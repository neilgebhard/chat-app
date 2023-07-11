'use client'

import { ClipLoader } from 'react-spinners'

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center bg-neutral-800">
      <ClipLoader color="#fff" size="5rem" />
    </div>
  )
}
