'use client'

import React, { useEffect, useRef } from 'react'
import { IoSend } from 'react-icons/io5'
import type { Database } from '@/types/supabase'
import Topbar from './components/Topbar'
import Channels from './components/Channels'
import Messages from './components/Messages'
import useStore from '@/lib/useStore'

export default function Chat() {
  const scrollToRef = useRef<HTMLDivElement>(null)

  const {
    session,
    channels,
    messages,
    activeChannelId,
    setActiveChannelId,
    insertMessage,
  } = useStore()

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

  return (
    <div className="flex h-screen">
      <div className="w-48">
        <Channels
          channels={channels}
          activeChannel={activeChannelId}
          setChannel={setActiveChannelId}
        />
      </div>
      <div className="flex-grow h-full overflow-scroll">
        <Topbar
          channels={channels}
          activeChannelId={activeChannelId}
          session={session}
        />
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
