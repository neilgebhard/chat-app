import type { Database } from '@/types/supabase'
import { formatTimeAgo } from '@/index'

type Message = Database['public']['Tables']['messages']['Row']

type MessagesProps = {
  messages: Message[] | null
}

function Messages({ messages }: MessagesProps) {
  return (
    <ul className="mt-14 mb-10 p-4">
      {messages?.map((message) => (
        <li className="mb-10" key={message.id}>
          <div>
            <span className="font-semibold text-sm">{message.username}</span>
            <span className="text-slate-500 text-xs font-light tracking-tight ml-2">
              {formatTimeAgo(message.inserted_at)}
            </span>
          </div>
          <div>{message.message}</div>
        </li>
      ))}
    </ul>
  )
}

export default Messages
