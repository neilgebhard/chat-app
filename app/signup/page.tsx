'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BeatLoader } from 'react-spinners'

export default function SignUp() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [arePasswordsEqual, setArePasswordsEqual] = useState<Boolean | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setArePasswordsEqual(null)
    setIsLoading(true)

    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value
    const confirmPassword = e.currentTarget.confirmPassword.value

    if (password !== confirmPassword) {
      setArePasswordsEqual(false)
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (!error && data.user) {
        router.push(`/confirm-email?email=${data.user.email}`)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
      setArePasswordsEqual(null)
    }
  }

  return (
    <form className='max-w-sm mx-auto text-slate-800' onSubmit={handleSubmit}>
      <p className='text-3xl font-bold my-10 text-center'>slak</p>
      <h1 className='text-4xl font-bold text-center'>Sign up</h1>
      <div className='mt-10'>
        <label className='block' htmlFor='email'>
          Email
        </label>
        <input
          id='email'
          className='border border-slate-300 w-full p-2 rounded'
          type='email'
          name='email'
          placeholder='user@email.com'
        />
      </div>
      <div className='mt-4'>
        <label className='block' htmlFor='password'>
          Password
        </label>
        <input
          id='password'
          className='border border-slate-300 w-full p-2 rounded'
          type='password'
          name='password'
          minlength='4'
          maxlength='30'
          required
        />
      </div>
      <div className='mt-4'>
        <label className='block' htmlFor='confirmPassword'>
          Confirm Password
        </label>
        <input
          id='confirmPassword'
          className='border border-slate-300 w-full p-2 rounded'
          type='password'
          name='confirmPassword'
          minlength='4'
          maxlength='30'
          required
        />
      </div>
      {arePasswordsEqual === false && (
        <div className='mt-2 text-red-600'>Passwords are not equal.</div>
      )}
      <button className='border p-2 rounded-md text-slate-50 bg-fuchsia-900 hover:bg-fuchsia-800 mt-4 w-full text-lg'>
        {isLoading ? <BeatLoader color='#fff' size={10} /> : 'Sign up'}
      </button>
      <p className='text-sm text-slate-500 text-center mt-5'>
        Already have an account?
      </p>
      <p className='text-sm text-blue-600 text-center mt-1 hover:underline cursor-pointer'>
        <Link href='/signin'>Log in here</Link>
      </p>
    </form>
  )
}
