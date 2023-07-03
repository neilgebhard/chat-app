'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const supabase = createClientComponentClient()

  console.log('AuthContext body')

  useEffect(() => {
    const getSession = async () => {
      const { data: sesh } = await supabase.auth.getSession()
      setSession(sesh)
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
      }
    )
    console.log('AuthContext useEffect')


    return () => authListener.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session: null }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
