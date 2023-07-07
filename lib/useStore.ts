'use client'

import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

import type { Database } from '@/types/supabase'

type Message = Database['public']['Tables']['messages']['Row']
type Channel = Database['public']['Tables']['channels']['Row']

export default function useStore() {
  const supabase = createClientComponentClient<Database>()

  const [session, setSession] = useState<Session | null>(null)
  const [channels, setChannels] = useState<Channel[] | null>(null)
  const [activeChannelId, setActiveChannelId] = useState(1)
  const [messages, setMessages] = useState<Message[] | null>(null)

  // Fetch session and listen to changes
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => setSession(session)
    )

    return () => authListener.subscription.unsubscribe()
  }, [])

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

  // Listen to changes for messages
  useEffect(() => {
    const messageListener = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => setMessages((m) => [...m, payload.new])
      )
      .subscribe()

    const channelListener = supabase
      .channel('public:channels')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'channels' },
        (payload) => setChannels((channels) => [...channels, payload.new])
      )
      .subscribe()

    //   .on(
    //     'postgres_changes',
    //     { event: 'DELETE', schema: 'public', table: 'channels' },
    //     (payload) => setChannels(channels => channels.filter(channel => channel.id !== payload.old.id)
    //   )

    return () => {
      messageListener.unsubscribe()
      channelListener.unsubscribe()
    }
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

  return {
    session,
    channels,
    messages,
    activeChannelId,
    setActiveChannelId,
    insertMessage,
    insertChannel,
  }
}
