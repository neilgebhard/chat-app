'use client'

import React, { useEffect, useRef } from 'react'
import { IoSend } from 'react-icons/io5'
import Topbar from './components/Topbar'
import Channels from './components/Channels'
import Messages from './components/Messages'
import { useStore } from './context/store'

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
    <div className="flex h-screen bg-neutral-900 text-neutral-300">
      <Channels
        channels={channels}
        activeChannel={activeChannelId}
        setChannel={setActiveChannelId}
      />
      <div className="h-full overflow-scroll">
        <Topbar
          channels={channels}
          activeChannelId={activeChannelId}
          session={session}
        />
        <Messages messages={messages} />
        <div ref={scrollToRef} />
        <div className="fixed bottom-1 right-1 left-[196px] bg-neutral-900">
          <form onSubmit={handleSubmit}>
            <button className="absolute right-1 top-1/2 -translate-y-1/2 border border-neutral-600 bg-neutral-800 px-2 py-2 rounded flex items-center gap-2 text-neutral-100 hover:border-neutral-400">
              send <IoSend className="text-neutral-300" size={'.8em'} />
            </button>
            <input
              id="message"
              className="bg-neutral-800 border border-neutral-600 focus:border-neutral-400 rounded w-full p-3 focus:outline-none pr-24"
              placeholder="Send a message"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
