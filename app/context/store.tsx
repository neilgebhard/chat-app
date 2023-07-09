'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createContext, useContext, useEffect, useState } from 'react'

import type { Database } from '@/types/supabase'
type Message = Database['public']['Tables']['messages']['Row']
type Channel = Database['public']['Tables']['channels']['Row']

const StoreContext = createContext(null)

const PUBLIC_CHANNEL_ID = 1

export const StoreProvider = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeChannelId, setActiveChannelId] = useState(PUBLIC_CHANNEL_ID)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data)
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
      }
    )

    return () => authListener.subscription.unsubscribe()
  }, [])

  // Fetch all messages for active channel
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        let { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('channel_id', activeChannelId)
          .order('inserted_at', { ascending: true })
        setMessages(data)
      } catch (error) {
        console.log('error', error)
      }
    }
    fetchMessages()
  }, [activeChannelId])

  // Fetch all channels
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        let { data, error } = await supabase.from('channels').select('*')
        setChannels(data)
      } catch (error) {
        console.log('error', error)
      }
    }
    fetchChannels()
  }, [])

  // Listen to messages
  useEffect(() => {
    const messageListener = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('payload', payload)
          if (payload.new && payload.new.channel_id === activeChannelId) {
            setMessages((messages) => [...messages, payload.new as Message])
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) =>
          setMessages((m) => m.filter((m) => m.id !== payload.old.id))
      )
      .subscribe()

    return () => {
      messageListener.unsubscribe()
    }
  }, [])

  // Listen to channels
  useEffect(() => {
    const channelListener = supabase
      .channel('public:channels')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'channels' },
        (payload) => setChannels((c) => [...c, payload.new as Channel])
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'channels' },
        (payload) =>
          setChannels((channels) =>
            channels.filter((channel) => channel.id !== payload.old.id)
          )
      )
      .subscribe()

    return () => {
      channelListener.unsubscribe()
    }
  }, [])

  // Insert channel into db
  const insertChannel = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .insert([{ slug, created_by: session!.user.id }])
      return { data, error }
    } catch (error) {
      console.log('error', error)
    }
  }

  // Insert message into db
  const insertMessage = async (message: string) => {
    try {
      const { data, error } = await supabase.from('messages').insert([
        {
          message,
          channel_id: activeChannelId,
          user_id: session!.user.id,
          username: session?.user.email,
        },
      ])
      return { data, error }
    } catch (error) {
      console.log('error', error)
    }
  }

  // Delete message from db
  const deleteMessage = async (id: number) => {
    try {
      let { data, error } = await supabase
        .from('messages')
        .delete()
        .match({ id })
      return { data, error }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <StoreContext.Provider
      value={{
        session,
        channels,
        messages,
        activeChannelId,
        setActiveChannelId,
        insertChannel,
        insertMessage,
        deleteMessage,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStorage = () => useContext(StoreContext)
