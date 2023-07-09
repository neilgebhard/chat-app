'use client'

import React, { useEffect, useRef } from 'react'
import { IoSend } from 'react-icons/io5'
import type { Database } from '@/types/supabase'
import Topbar from './components/Topbar'
import Channels from './components/Channels'
import Messages from './components/Messages'
import { useStorage } from './context/store'

export default function Chat() {
  const scrollToRef = useRef<HTMLDivElement>(null)

  const {
    session,
    channels,
    messages,
    activeChannelId,
    setActiveChannelId,
    insertMessage,
  } = useStorage()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    if (!message || !session) return
    e.target.elements.message.value = ''
    insertMessage(message)
  }

  useEffect(() => {
    scrollToRef.current!.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  console.log('chat render')

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <Channels
        channels={channels}
        activeChannel={activeChannelId}
        setChannel={setActiveChannelId}
      />
      <div className="flex-grow h-full overflow-scroll">
        <Topbar
          channels={channels}
          activeChannelId={activeChannelId}
          session={session}
        />
        <Messages messages={messages} />
        <div ref={scrollToRef} />
        <div className="fixed bottom-1 right-1 left-[196px] bg-gray-900">
          <form onSubmit={handleSubmit}>
            <button className="absolute right-1 top-1/2 -translate-y-1/2 border border-slate-600 bg-slate-800 px-2 py-2 rounded flex items-center gap-2 text-gray-100 hover:border-slate-400">
              send <IoSend className="text-slate-300" size={'.8em'} />
            </button>
            <input
              id="message"
              className="bg-gray-800 border border-gray-600 focus:border-slate-400 rounded w-full p-3 focus:outline-none pr-24"
              placeholder="Send a message"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
