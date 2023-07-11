import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import type { Database } from '@/types/supabase'
import { AiOutlineClose } from 'react-icons/ai'
import { HiOutlinePlusSm } from 'react-icons/hi'
import { useStore } from '../context/store'
import AddChannelModal from './AddChannelModal'

type Channel = Database['public']['Tables']['channels']['Row']

type ChannelsProps = {
  channels: Channel[] | null
  activeChannel: number
  setChannel: (id: number) => void
}

function Channels({ channels, activeChannel, setChannel }: ChannelsProps) {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ul className="bg-zinc-900 h-full px-2 py-3 border-r border-r-zinc-800 w-48">
        {channels?.map((channel) => (
          <li className="mb-1" key={channel.id}>
            <button
              className={`font-extralight cursor-pointer rounded text-left px-2 py-1 w-44 ${
                activeChannel === channel.id
                  ? 'bg-sky-700 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800'
              }`}
              onClick={() => setChannel(channel.id)}
            >
              # {channel.slug}
            </button>
          </li>
        ))}
        <AddChannelModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </ul>
    </>
  )
}

export default Channels
