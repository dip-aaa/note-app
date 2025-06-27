import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useAuth } from './AuthContext'

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCompleted, setShowCompleted] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [user])

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching todos:', error)
      } else {
        setTodos(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            task: newTodo.trim(),
            user_id: user.id,
            completed: false
          }
        ])
        .select()

      if (error) {
        console.error('Error adding todo:', error)
      } else {
        setTodos([...todos, ...data])
        setNewTodo('')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const toggleTodo = async (id, completed) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id)

      if (error) {
        console.error('Error updating todo:', error)
      } else {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !completed } : todo
        ))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting todo:', error)
      } else {
        setTodos(todos.filter(todo => todo.id !== id))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const incompleteTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)

  if (loading) {
    return (
      <div className="todo-container">
        <div className="todo-card">
          <div className="loading-spinner">Loading your todos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="todo-container">
      <div className="todo-card">
        <div className="todo-header">
          <h1 className="todo-title">To do list</h1>
          <div className="todo-stats">
            <span className="stat-item">
              <span className="stat-icon">📝</span>
              {incompleteTodos.length} pending
            </span>
            <span className="stat-item">
              <span className="stat-icon">✅</span>
              {completedTodos.length} completed
            </span>
          </div>
        </div>

        <form onSubmit={addTodo} className="add-todo-form">
          <div className="input-group">
            <span className="add-icon">+</span>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="todo-input"
              maxLength={100}
            />
          </div>
        </form>

        <div className="todo-list">
          {incompleteTodos.map((todo) => (
            <div key={todo.id} className="todo-item">
              <div className="todo-checkbox-container">
                <input
                  type="checkbox"
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="todo-checkbox"
                />
                <label htmlFor={`todo-${todo.id}`} className="checkbox-label"></label>
              </div>
              <span className="todo-text">{todo.task}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-btn"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {completedTodos.length > 0 && (
          <div className="completed-section">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="toggle-completed-btn"
            >
              <span className="toggle-icon">{showCompleted ? '▼' : '▶'}</span>
              {completedTodos.length} Checked items
            </button>
            
            {showCompleted && (
              <div className="completed-list">
                {completedTodos.map((todo) => (
                  <div key={todo.id} className="todo-item completed">
                    <div className="todo-checkbox-container">
                      <input
                        type="checkbox"
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id, todo.completed)}
                        className="todo-checkbox"
                      />
                      <label htmlFor={`todo-${todo.id}`} className="checkbox-label"></label>
                    </div>
                    <span className="todo-text completed-text">{todo.task}</span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="delete-btn"
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {todos.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks yet!</h3>
            <p>Add your first task above to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoList
