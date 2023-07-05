'use client'

import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'

import type { Database } from '@/types/supabase'
import { formatTimeAgo } from '..'
import Topbar from './components/Topbar'

type Message = Database['public']['Tables']['messages']['Row']
type Channel = Database['public']['Tables']['channels']['Row']

export default function Chat() {
  const supabase = createClientComponentClient<Database>()
  const [channelId, setChannelId] = useState(1)
  const [channelName, setChannelName] = useState('general')
  const [messages, setMessages] = useState<Message[] | null>(null)
  const [channels, setChannels] = useState<Channel[] | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const scrollToRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        let { data } = await supabase
          .from('messages')
          .select('*')
          .eq('channel_id', channelId)
          .order('inserted_at', { ascending: true })
        setMessages(data)
      } catch (error) {
        console.log('error', error)
      }
    }
    fetchMessages()
  }, [channelId])

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        let { data } = await supabase.from('channels').select('*')
        setChannels(data)
      } catch (error) {
        console.log('error', error)
      }
    }
    fetchChannels()
  }, [])

  useEffect(() => {
    const messageListener = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => setMessages((m) => [...m, payload.new])
      )
      .subscribe()

    return () => {
      messageListener.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (channels?.length > 0) {
      const activeChannel = channels?.filter(
        (channel) => channel.id === channelId
      )
      setChannelName(activeChannel![0].slug)
    }
  }, [channelId])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    if (!message || !session) return
    e.target.elements.message.value = ''
    try {
      await supabase.from('messages').insert([
        {
          message,
          channel_id: channelId,
          user_id: session.user.id,
          username: session.user.email,
        },
      ])
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    scrollToRef.current!.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  return (
    <div className="flex h-screen">
      <div className="w-48">
        <Channels
          channels={channels}
          activeChannel={channelId}
          setChannel={setChannelId}
        />
      </div>
      <div className="flex-grow h-full overflow-scroll">
        <Topbar channelName={channelName} />
        <Messages messages={messages} />
        <div ref={scrollToRef} />
        <div className="fixed bottom-1 right-1 left-[196px] bg-white">
          <form onSubmit={handleSubmit}>
            <button className="absolute right-1 top-1/2 -translate-y-1/2 border border-slate-400 px-2 py-1 rounded flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:border-slate-600">
              send <IoSend className="text-slate-600" size={'.8em'} />
            </button>
            <input
              id="message"
              className="border border-slate-300 focus:border-slate-400 rounded w-full p-2 focus:outline-none"
              placeholder="Send a message"
            />
          </form>
        </div>
      </div>
    </div>
  )
}

type ChannelsProps = {
  channels: Channel[] | null
  activeChannel: number
  setChannel: (id: number) => void
}

function Channels({ channels, activeChannel, setChannel }: ChannelsProps) {
  return (
    <ul className="bg-fuchsia-950 h-full px-2 py-3">
      {channels?.map((channel) => (
        <li className="mb-1" key={channel.id}>
          <button
            className={`text-fuchsia-200 font-extralight cursor-pointer rounded w-full text-left px-2 py-1 ${
              activeChannel === channel.id
                ? 'bg-sky-700 text-white'
                : 'hover:bg-fuchsia-900'
            }`}
            onClick={() => setChannel(channel.id)}
          >
            # {channel.slug}
          </button>
        </li>
      ))}
    </ul>
  )
}

type MessagesProps = {
  messages: Message[] | null
}

function Messages({ messages }: MessagesProps) {
  return (
    <ul className="mt-14 mb-10 p-4">
      {messages?.map((message) => (
        <li className="mb-10" key={message.id}>
          <div>
            <span className="font-semibold text-sm">{message.username}</span>
            <span className="text-slate-500 text-xs font-light tracking-tight ml-2">
              {formatTimeAgo(message.inserted_at)}
            </span>
          </div>
          <div>{message.message}</div>
        </li>
      ))}
    </ul>
  )
}
