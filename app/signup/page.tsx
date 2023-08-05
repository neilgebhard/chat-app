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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
      <p className="text-2xl font-bold py-10 text-center">Chat App</p>
      <h1 className="text-4xl font-bold text-center">Sign up</h1>
      <div className="mt-10">
        <label className="block" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="bg-neutral-800 border border-neutral-600 focus:border-neutral-400 rounded w-full p-3 focus:outline-none"
          type="email"
          name="email"
          placeholder="user@email.com"
          disabled={isLoading}
          required
        />
      </div>
      <div className="mt-4">
        <label className="block" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="bg-neutral-800 border border-neutral-600 focus:border-neutral-400 rounded w-full p-3 focus:outline-none"
          type="password"
          name="password"
          minLength={4}
          maxLength={30}
          disabled={isLoading}
          required
        />
      </div>
      <div className="mt-4">
        <label className="block" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          className="bg-neutral-800 border border-neutral-600 focus:border-neutral-400 rounded w-full p-3 focus:outline-none"
          type="password"
          name="confirmPassword"
          minLength={4}
          maxLength={30}
          disabled={isLoading}
          required
        />
      </div>
      {arePasswordsEqual === false && (
        <div className="mt-2 text-red-600">Passwords are not equal.</div>
      )}
      <button
        className="border-neutral-600 px-2 py-2 rounded-md text-neutral-100 bg-neutral-700 hover:bg-neutral-600 mt-6 w-full text-lg"
        disabled={isLoading}
      >
        {isLoading ? <BeatLoader color="#fff" size={10} /> : 'Sign up'}
      </button>
      <p className="text-sm text-neutral-500 text-center mt-5">
        Already have an account?
      </p>
      <p className="text-sm text-blue-500 text-center mt-1 hover:underline cursor-pointer">
        <Link href="/signin">Log in here</Link>
      </p>
    </form>
  )
}
