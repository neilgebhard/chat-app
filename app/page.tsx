import {
  createServerActionClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return redirect('/signin')

  const handleSignOut = async () => {
    'use server'
    const supabase = createServerActionClient({ cookies })
    const { error } = await supabase.auth.signOut()
    console.log(error)
    revalidatePath('/')
  }

  return (
    <div>
      <form>
        <button className='border px-3 py-2 rounded' formAction={handleSignOut}>
          Log out
        </button>
      </form>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
