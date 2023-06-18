'use client'

import { useSearchParams } from 'next/navigation'

export default function ConfirmEmail() {
  const email = useSearchParams().get('email')

  return (
    <div className='text-center'>
      <div className='max-w-md mx-auto mt-20'>
        <h1 className='text-2xl font-bold mb-4'>Verification link sent!</h1>
        <p>
          We emailed a confirmation link to <strong>{email}</strong>.
        </p>
        <p>Check your email to confirm your account!</p>
      </div>
    </div>
  )
}
