import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://npdypxotrbyflwkbftbf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wZHlweG90cmJ5Zmx3a2JmdGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODIyMDgsImV4cCI6MjA2NjM1ODIwOH0.9pN_7soxpfRhI3uct1JKGgYtKtxJ_iZ3543gDek1mXo'

const supabase = createClient(supabaseUrl, supabaseKey)

// This script will clear all auth state
const clearAuth = async () => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut()
    
    // Clear local storage
    localStorage.removeItem('supabase.auth.token')
    localStorage.removeItem('supabase.auth.user')
    
    console.log('Auth state cleared successfully!')
    
    // Reload the page
    window.location.href = '/login'
  } catch (error) {
    console.error('Error clearing auth state:', error)
  }
}

// Execute immediately
clearAuth()

export default clearAuth
