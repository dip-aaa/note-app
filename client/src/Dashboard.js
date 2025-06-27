import React from 'react'
import { useAuth } from './AuthContext'
import TodoList from './TodoList'

const Dashboard = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    }
  }

  return (
    <div className="container">
      <div className="dashboard-header-bar">
        <div className="user-welcome">
          <h2>Welcome, {user?.email?.split('@')[0]}!</h2>
        </div>
        <button 
          onClick={handleSignOut}
          className="btn btn-secondary sign-out-btn"
        >
          Sign Out
        </button>
      </div>
      
      <TodoList />
    </div>
  )
}

export default Dashboard
