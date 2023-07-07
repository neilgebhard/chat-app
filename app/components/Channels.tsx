import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import type { Database } from '@/types/supabase'
import { AiOutlineClose } from 'react-icons/ai'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import useStore from '@/lib/useStore'

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
  const { insertChannel } = useStore()

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
        className="text-fuchsia-200 font-extralight cursor-pointer rounded w-full text-left px-2 py-1"
        onClick={openModal}
      >
        + Add channel
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Create a channel
                    </Dialog.Title>
                    <AiOutlineClose
                      className="text-xl cursor-pointer"
                      color="#333"
                      onClick={closeModal}
                    />
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mt-2">
                      <label className="block" htmlFor="name">
                        Name
                      </label>
                      <input
                        className="border border-slate-300 w-full p-2 rounded"
                        id="name"
                        type="text"
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
