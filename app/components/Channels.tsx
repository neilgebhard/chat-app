import { useStore } from '../context/store'
import { HiOutlinePlusSm } from 'react-icons/hi'
import { useAddChannelModal } from '../context/addChannelModal'

function Channels() {
  const { channels, activeChannelId, setActiveChannelId } = useStore()

  const { openModal } = useAddChannelModal()

  return (
    <>
      <ul className="bg-zinc-900 h-full px-2 py-3 border-r border-r-zinc-800 w-48">
        {channels?.map((channel) => (
          <li className="mb-1" key={channel.id}>
            <button
              className={`font-extralight cursor-pointer rounded text-left px-2 py-1 w-44 ${
                activeChannelId === channel.id
                  ? 'bg-sky-700 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800'
              }`}
              onClick={() => setActiveChannelId(channel.id)}
            >
              # {channel.slug}
            </button>
          </li>
        ))}
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
      </ul>
    </>
  )
}

export default Channels
