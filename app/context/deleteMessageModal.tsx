'use client'

import { formatTimeAgo } from '@/index'
import { Database } from '@/types/supabase'
import { Transition, Dialog } from '@headlessui/react'
import { Fragment, createContext, useContext, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useStore } from './store'

type Message = Database['public']['Tables']['messages']['Row']

type ContextType = {
  openModal: (message: Message) => void
}

const DeleteMessageModalContext = createContext<ContextType>({} as ContextType)

export const DeleteMessageModalProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)

  const { deleteMessage } = useStore()

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = (message: Message) => {
    setMessage(message)
    setIsOpen(true)
  }

  const handleDelete = async () => {
    if (message) deleteMessage(message.id)
    closeModal()
  }

  return (
    <DeleteMessageModalContext.Provider value={{ openModal }}>
      {children}
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
                      className="text-xl font-medium leading-6"
                    >
                      Delete message
                    </Dialog.Title>
                    <AiOutlineClose
                      className="text-xl cursor-pointer"
                      color="#ccc"
                      onClick={closeModal}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-neutral-300">
                      Are you sure you want to delete this message? This cannot
                      be undone.
                    </p>
                  </div>
                  <div
                    className="group px-4 py-2 relative break-words border border-zinc-700 rounded mt-4"
                    key={message?.id}
                  >
                    <div>
                      <span className="font-semibold text-sm">
                        {message?.username}
                      </span>
                      <span className="text-neutral-400 text-xs font-light tracking-tight ml-2">
                        {formatTimeAgo(message?.inserted_at)}
                      </span>
                    </div>
                    <p className="font-light">{message?.message}</p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded-md border border-transparent bg-red-900 px-4 py-2 text-sm font-medium text-red-50 hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </DeleteMessageModalContext.Provider>
  )
}

export const useDeleteMessageModal = () => useContext(DeleteMessageModalContext)
