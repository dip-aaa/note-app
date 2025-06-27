const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 5000

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Middleware
app.use(cors())
app.use(express.json())

// Middleware to verify Supabase JWT token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token verification failed' })
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Supabase Auth Server is running!',
    timestamp: new Date().toISOString()
  })
})

// Get user profile (protected route)
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    res.json({
      user: req.user,
      profile: data || null
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user profile (protected route)
app.put('/api/profile', verifyToken, async (req, res) => {
  try {
    const { display_name, bio, avatar_url } = req.body

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: req.user.id,
        display_name,
        bio,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    res.json({ profile: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all users (protected route - admin only)
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    // Check if user has admin role (you can customize this logic)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) throw error

    res.json({ users })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
})
