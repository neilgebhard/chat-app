import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { VscSignOut } from 'react-icons/vsc'
import { FaUserAlt } from 'react-icons/fa'
import { Database } from '@/types/supabase'
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type Channel = Database['public']['Tables']['channels']['Row']

type TopbarProps = {
  session: Session | null
  channels: Channel[] | null
  activeChannelId: number
}

const Topbar = ({ session, channels, activeChannelId }: TopbarProps) => {
  const [channelName, setChannelName] = useState('general')

  // Get active channel name
  useEffect(() => {
    if (channels && channels?.length > 0) {
      const data = channels?.filter((channel) => channel.id === activeChannelId)
      setChannelName(data![0].slug)
    }
  }, [activeChannelId])

  return (
    <div className="border-b fixed bg-white py-2 px-5 left-48 right-0">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold"># {channelName}</h2>
        <UserDropdown session={session} />
      </div>
    </div>
  )
}

type UserDropdownProps = {
  session: Session | null
}

function UserDropdown({ session }: UserDropdownProps) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-60 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <FaUserAlt />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 min-w-[224px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <p
                    className={`text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {session?.user.email}
                  </p>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm font-semibold`}
                    onClick={signOut}
                  >
                    <VscSignOut className="mr-2 h-5 w-5" aria-hidden="true" />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default Topbar
