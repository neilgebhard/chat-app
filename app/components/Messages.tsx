import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import type { Database } from '@/types/supabase'
import { formatTimeAgo } from '@/index'
import { BsTrash } from 'react-icons/bs'
import { AiOutlineClose } from 'react-icons/ai'
import { useStore } from '../context/store'
import { Session } from '@supabase/auth-helpers-nextjs'

type Message = Database['public']['Tables']['messages']['Row']

type MessagesProps = {
  messages: Message[] | null
}

function Messages({ messages }: MessagesProps) {
  let [isOpen, setIsOpen] = useState(false)
  let [messageToDelete, setMessageToDelete] = useState<Message | null>(null)

  const { session } = useStore()

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  return (
    <>
      <ul className="mt-14 mb-20">
        {messages?.map((message) => (
          <Message
            key={message.id}
            message={message}
            setMessageToDelete={setMessageToDelete}
            openModal={openModal}
            session={session}
          />
        ))}
      </ul>
      <DeleteMessageModal
        message={messageToDelete}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </>
  )
}

export default Messages

type MessageProps = {
  message: Message
  setMessageToDelete: (message: Message) => void
  openModal: () => void
  session: Session | null
}

function Message({
  message,
  setMessageToDelete,
  openModal,
  session,
}: MessageProps) {
  const handleClick = () => {
    setMessageToDelete(message)
    openModal()
  }

  return (
    <li
      className="group hover:bg-neutral-800 px-4 py-2 relative break-words"
      key={message.id}
    >
      <div>
        <span
          className={`font-semibold text-sm ${
            session?.user?.id === message.user_id && 'text-teal-100'
          }`}
        >
          {message.username}
        </span>
        <span className="text-neutral-400 text-xs font-light tracking-tight ml-2">
          {formatTimeAgo(message.inserted_at)}
        </span>
        {session?.user?.id === message.user_id && (
          <BsTrash
            onClick={handleClick}
            className="text-red-100 bg-red-500 rounded h-5 w-5 p-0.5 hover:bg-red-400 cursor-pointer ml-3 hidden group-hover:inline"
          />
        )}
      </div>
      <p>{message.message}</p>
    </li>
  )
}

type DeleteMessageModalProps = {
  message: Message | null
  isOpen: boolean
  closeModal: () => void
}

function DeleteMessageModal({
  isOpen,
  closeModal,
  message,
}: DeleteMessageModalProps) {
  const { deleteMessage } = useStore()

  const handleDelete = async () => {
    if (message) deleteMessage(message.id)
    closeModal()
  }

  return (
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
                    Are you sure you want to delete this message? This cannot be
                    undone.
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
  )
}
