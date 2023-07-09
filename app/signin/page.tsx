'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BeatLoader } from 'react-spinners'

export default function SignIn() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [signinError, setSigninError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value

    if (!email || !password) return

    setIsLoading(true)
    setSigninError(false)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setSigninError(true)
      } else {
        router.push('/')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="max-w-sm mx-auto text-slate-800" onSubmit={handleSubmit}>
      <p className="text-3xl font-bold my-10 text-center">slak</p>
      <h1 className="text-4xl font-bold text-center">Sign in</h1>
      <div className="mt-10">
        <label className="block" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="border border-slate-300 w-full p-2 rounded"
          type="email"
          name="email"
          placeholder="user@email.com"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="border border-slate-300 w-full p-2 rounded"
          type="password"
          name="password"
          required
        />
      </div>
      {signinError && (
        <p className="pt-2 text-red-600">Sign in unsuccessful.</p>
      )}
      <button className="border px-2 py-2 rounded-md text-slate-50 bg-fuchsia-900 hover:bg-fuchsia-800 mt-4 w-full text-lg">
        {isLoading ? <BeatLoader color="#fff" size={10} /> : 'Sign in'}
      </button>
      <p className="text-sm text-slate-500 text-center mt-5">
        Already have an account?
      </p>
      <p className="text-sm text-blue-600 text-center mt-1 hover:underline cursor-pointer">
        <Link href="/signup">Sign up here</Link>
      </p>
    </form>
  )
}
