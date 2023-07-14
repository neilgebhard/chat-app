import type { Database } from '@/types/supabase'
import { formatTimeAgo } from '@/index'
import { BsTrash } from 'react-icons/bs'
import { useStore } from '../context/store'
import { useDeleteMessageModal } from '../context/deleteMessageModal'

type Message = Database['public']['Tables']['messages']['Row']

type MessagesProps = {
  messages: Message[] | null
}

function Messages({ messages }: MessagesProps) {
  return (
    <ul className="mt-14 mb-20">
      {messages?.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </ul>
  )
}

export default Messages

type MessageProps = {
  message: Message
}

function Message({ message }: MessageProps) {
  const { session } = useStore()
  const { openModal } = useDeleteMessageModal()

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
            onClick={() => openModal(message)}
            className="text-red-100 bg-red-500 rounded h-5 w-5 p-0.5 hover:bg-red-400 cursor-pointer ml-3 hidden group-hover:inline"
          />
        )}
      </div>
      <p>{message.message}</p>
    </li>
  )
}
