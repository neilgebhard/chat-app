import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { VscSignOut } from 'react-icons/vsc'
import { FaUserAlt } from 'react-icons/fa'
import { Database } from '@/types/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useStore } from '../context/store'

const Topbar = () => {
  const [channelName, setChannelName] = useState('general')
  const { channels, activeChannelId } = useStore()

  // Get name of active channel
  useEffect(() => {
    if (channels && channels?.length > 0) {
      const data = channels?.filter((channel) => channel.id === activeChannelId)
      setChannelName(data![0].slug)
    }
  }, [activeChannelId])

  return (
    <div className="border-b border-b-neutral-800 fixed bg-neutral-900 py-2 px-5 left-48 right-0 z-10">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold"># {channelName}</h2>
        <UserDropdown />
      </div>
    </div>
  )
}

function UserDropdown() {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const { session } = useStore()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
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
          <Menu.Items className="text-neutral-300 absolute right-0 mt-2 min-w-[224px] origin-top-right divide-y divide-neutral-500 rounded-md bg-neutral-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <p
                    className={`flex w-full items-center rounded-md px-2 py-4 text-sm`}
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
                      active && 'bg-neutral-600 text-neutral-300'
                    } flex w-full items-center rounded-md px-2 py-2 text-sm font-semibold`}
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
