import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://npdypxotrbyflwkbftbf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wZHlweG90cmJ5Zmx3a2JmdGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODIyMDgsImV4cCI6MjA2NjM1ODIwOH0.9pN_7soxpfRhI3uct1JKGgYtKtxJ_iZ3543gDek1mXo'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    redirectTo: window.location.origin
  }
})
