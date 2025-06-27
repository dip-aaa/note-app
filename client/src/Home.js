import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
      } else {
        setNotes(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            title: 'New Note',
            user_id: user.id,
          },
        ])
        .select();

      if (error) {
        console.error('Error adding note:', error);
      } else {
        const newNote = data[0];
        setNotes([newNote, ...notes]);
        // Navigate to the new note
        navigate(`/note/${newNote.id}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openNote = (id) => {
    navigate(`/note/${id}`);
  };

  const deleteNote = async (e, noteId) => {
    e.stopPropagation(); // Prevent opening the note
    
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting note:', error);
      } else {
        setNotes(notes.filter((note) => note.id !== noteId));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      // Clear localStorage manually first to ensure proper cleanup
      localStorage.removeItem('supabase.auth.user');
      localStorage.removeItem('supabase.auth.token');
      
      const { error } = await signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      }
      // The App.js component will handle redirection
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your notes...</div>;
  }

  return (
    <div className="home-container">
      <div className="header">
        <div className="app-title">
          <h1>Notes & Todos</h1>
          <p className="app-subtitle">Organize your thoughts and tasks</p>
        </div>
        <button onClick={handleSignOut} className="compact-sign-out-btn">
          Sign Out
        </button>
      </div>
      
      {notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No notes yet!</h3>
          <p>Tap the + button to create your first note.</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div
              key={note.id}
              className="note-box"
              onClick={() => openNote(note.id)}
            >
              <div className="note-box-header">
                <h3>{note.title}</h3>
                <button 
                  className="delete-note-btn" 
                  onClick={(e) => deleteNote(e, note.id)}
                  title="Delete note"
                >
                  ×
                </button>
              </div>
              <p className="note-date">
                {new Date(note.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
      
      <button className="add-note-btn" onClick={addNote}>
        +
      </button>
    </div>
  );
};

export default Home;
