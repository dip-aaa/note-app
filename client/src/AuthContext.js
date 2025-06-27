import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage to avoid flashing
    const storedUser = localStorage.getItem('supabase.auth.user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  // Session initialization
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          localStorage.setItem('supabase.auth.user', JSON.stringify(session.user))
        } else {
          setUser(null)
          localStorage.removeItem('supabase.auth.user')
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setAuthError(error.message)
        setUser(null)
        localStorage.removeItem('supabase.auth.user')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          localStorage.setItem('supabase.auth.user', JSON.stringify(session.user))
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          localStorage.removeItem('supabase.auth.user')
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) setAuthError(error.message)
      return { data, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true)
      setAuthError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) setAuthError(error.message)
      return { data, error }
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) setAuthError(error.message)
      // Ensure user state and localStorage are cleared
      setUser(null)
      localStorage.removeItem('supabase.auth.user')
      return { error }
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = async (email) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) setAuthError(error.message)
      return { data, error }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
