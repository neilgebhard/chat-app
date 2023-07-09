import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import type { Database } from '@/types/supabase'
import { AiOutlineClose } from 'react-icons/ai'
import { HiOutlinePlusSm } from 'react-icons/hi'
import { useStorage } from '../context/store'

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
      <ul className="bg-zinc-900 h-full px-2 py-3 w-48 border-r border-r-zinc-800">
        {channels?.map((channel) => (
          <li className="mb-1 w-48" key={channel.id}>
            <button
              className={`font-extralight cursor-pointer rounded w-full text-left px-2 py-1 ${
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

type AddChannelModalProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

function AddChannelModal({ isOpen, setIsOpen }: AddChannelModalProps) {
  const { insertChannel } = useStorage()

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const slug = e.target.elements.name.value.trim()
    if (!slug) return
    insertChannel(slug)
    closeModal()
  }

  return (
    <>
      <li
        className="text-zinc-400 font-extralight cursor-pointer rounded w-full text-left px-2 py-1 hover:bg-zinc-800"
        onClick={openModal}
      >
        <div className="inline-flex items-center justify-center gap-2">
          <span className="bg-zinc-700 rounded w-5 h-5 inline-flex items-center justify-center">
            <HiOutlinePlusSm size={'1rem'} />
          </span>{' '}
          Add channel
        </div>
      </li>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all bg-zinc-800 text-zinc-200">
                  <div className="flex justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      Create a channel
                    </Dialog.Title>
                    <AiOutlineClose
                      className="text-xl cursor-pointer"
                      color="#ccc"
                      onClick={closeModal}
                    />
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mt-2">
                      <label className="block" htmlFor="name">
                        Name
                      </label>
                      <input
                        className="border border-zinc-500 w-full p-2 rounded bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        id="name"
                        type="text"
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-zinc-600 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Add Channel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
