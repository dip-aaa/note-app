import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const Note = () => {
  const [noteTitle, setNoteTitle] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNote();
      // Start with an empty items list - this will only be stored locally
      setItems([]);
      setLoading(false);
    }
  }, [user, id]);

  const fetchNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('title')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching note:', error);
        navigate('/'); // Redirect if note not found
      } else {
        setNoteTitle(data.title);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateNoteTitle = async (newTitle) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ title: newTitle })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating note title:', error);
      } else {
        setNoteTitle(newTitle);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    // Generate a local ID for the item
    const newId = Date.now().toString();
    setItems([...items, { id: newId, text: newItem.trim(), completed: false }]);
    setNewItem('');
  };

  const toggleItem = (itemId) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const goBack = () => {
    navigate('/');
  };

  const handleKeyDown = (e) => {
    // Allow adding new item with Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(e);
    }
  };

  if (loading) {
    return <div className="loading">Loading your note...</div>;
  }

  return (
    <div className="note-container">
      <div className="note-header">
        <button onClick={goBack} className="back-btn">
          Back
        </button>
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          onBlur={(e) => updateNoteTitle(e.target.value)}
          className="note-title-input"
          placeholder="Note title"
        />
      </div>

      <div className="todo-section">
        <div className="input-group">
          <span className="add-icon">+</span>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task and press Enter..."
            className="todo-input"
          />
          <button 
            onClick={addItem} 
            className="add-item-btn"
          >
            Add
          </button>
        </div>

        <div className="todos-list">
          {items.map((item) => (
            <div key={item.id} className="todo-item">
              <div className="todo-checkbox-container">
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                  className="todo-checkbox"
                />
                <label htmlFor={`item-${item.id}`} className="checkbox-label"></label>
              </div>
              <span className={`todo-text ${item.completed ? 'completed-text' : ''}`}>
                {item.text}
              </span>
              <button
                onClick={() => deleteItem(item.id)}
                className="delete-btn"
                title="Delete item"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="empty-todos">
            <p>No items yet. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Note;
