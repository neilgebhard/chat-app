'use client'

import { Transition, Dialog } from '@headlessui/react'
import { createContext, Fragment, useContext, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useStore } from './store'

type ContextType = {
  openModal: () => void
}

const AddChannelModalContext = createContext<ContextType>({} as ContextType)

export const AddChannelModalProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const { insertChannel } = useStore()

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      elements: {
        name: {
          value: string
        }
      }
    }
    const slug = target.elements.name.value.trim()
    if (!slug) return
    insertChannel(slug)
    closeModal()
  }

  return (
    <AddChannelModalContext.Provider value={{ openModal }}>
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
                        type="submit"
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
    </AddChannelModalContext.Provider>
  )
}

export const useAddChannelModal = () => useContext(AddChannelModalContext)
