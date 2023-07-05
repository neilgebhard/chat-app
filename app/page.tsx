import {
  createServerActionClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Chat from './chat'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import type { Database } from '@/types/supabase'

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const handleSignOut = async () => {
    'use server'
    const supabase = createServerActionClient({ cookies })
    const { error } = await supabase.auth.signOut()
    revalidatePath('/')
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/signin')
  }

  return <Chat />
}
