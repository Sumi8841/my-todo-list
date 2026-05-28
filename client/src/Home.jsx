import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', config);
      setTasks(res.data);
    } catch (err) { console.log(err); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/tasks', { task: newTask, category: category, due_date: dueDate || null }, config);
      setNewTask('');
      setDueDate('');
      setCategory('General');
      fetchTasks();
    } catch (err) { console.log(err); }
  };

  const toggleTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}/toggle`, {}, config);
      fetchTasks();
    } catch (err) { console.log(err); }
  };

  const startEdit = (id, currentText, currentDueDate) => {
    setEditingId(id);
    setEditText(currentText);
    if (currentDueDate) {
      setEditDueDate(new Date(currentDueDate).toISOString().substring(0, 16));
    } else {
      setEditDueDate('');
    }
  };

  const handleEditSave = async (id) => {
    if (!editText.trim()) return;
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}/edit`, { newTaskText: editText, due_date: editDueDate || null }, config);
      setEditingId(null);
      fetchTasks();
    } catch (err) { console.log(err); }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task? 🛑')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);
        fetchTasks();
      } catch (err) { console.log(err); }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getCategoryColor = (cat) => {
    if (cat === 'Work') return '#f59e0b';
    if (cat === 'Study') return '#10b981';
    if (cat === 'Personal') return '#ec4899';
    return '#64748b';
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return '⏰ ' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredTasks = tasks.filter(t => {
    const matchesCategory = selectedFilter === 'All' || String(t.category).toLowerCase() === String(selectedFilter).toLowerCase();
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Active' && t.status === 'active') || (statusFilter === 'Completed' && t.status === 'completed');
    const matchesSearch = t.task.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;

  const themeContainer = {
    background: isDarkMode ? '#1e293b' : '#f1f5f9',
    color: isDarkMode ? '#fff' : '#000',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.3s ease'
  };

  const themeCard = {
    background: isDarkMode ? '#334155' : '#ffffff',
    color: isDarkMode ? '#fff' : '#1e293b',
    padding: '25px',
    borderRadius: '15px',
    width: '600px',
    boxShadow: isDarkMode ? '0 10px 25px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={themeContainer}>
      <div style={themeCard}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>Welcome, {username}! 👋</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: isDarkMode ? '#e2e8f0' : '#1e293b', color: isDarkMode ? '#1e293b' : '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', background: isDarkMode ? '#1e293b' : '#e2e8f0', padding: '12px', borderRadius: '8px', marginBottom: '20px', justifyContent: 'space-around', fontSize: '14px' }}>
          <div>📋 Total Tasks: <strong style={{ color: '#38bdf8' }}>{totalTasks}</strong></div>
          <div>✅ Completed: <strong style={{ color: '#4ade80' }}>{completedTasks} / {totalTasks}</strong></div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          {['All', 'Active', 'Completed'].map(status => (
            <button key={status} onClick={() => setStatusFilter(status)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', background: statusFilter === status ? '#3b82f6' : (isDarkMode ? '#475569' : '#cbd5e1'), color: statusFilter === status ? '#fff' : (isDarkMode ? '#fff' : '#000') }}>
              {status}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input type="text" placeholder="🔍 Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', boxSizing: 'border-box', background: isDarkMode ? '#475569' : '#f1f5f9', color: isDarkMode ? '#fff' : '#000', border: isDarkMode ? 'none' : '1px solid #cbd5e1' }} />
        </div>

        <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Add a new task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: isDarkMode ? 'none' : '1px solid #cbd5e1', background: isDarkMode ? '#fff' : '#f8fafc' }} />
            
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: isDarkMode ? 'none' : '1px solid #cbd5e1', background: '#fff', color: '#000', cursor: 'pointer', fontWeight: '500' }}>
              <option value="General">🌐 General</option>
              <option value="Work">💼 Work</option>
              <option value="Study">📚 Study</option>
              <option value="Personal">🏠 Personal</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: isDarkMode ? '#cbd5e1' : '#475569' }}>Due Date:</span>
            <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: isDarkMode ? 'none' : '1px solid #cbd5e1', color: '#000', flex: 1, background: isDarkMode ? '#fff' : '#f8fafc' }} />
            <button type="submit" style={{ padding: '10px 25px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Add</button>
          </div>
        </form>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
          {['All', 'General', 'Work', 'Study', 'Personal'].map(cat => (
            <button key={cat} onClick={() => setSelectedFilter(cat)} style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', background: selectedFilter === cat ? '#4f46e5' : (isDarkMode ? '#475569' : '#cbd5e1'), color: isDarkMode ? '#fff' : '#000' }}>
              {cat === 'All' ? '🌟 All' : cat === 'Work' ? '💼 Work' : cat === 'Study' ? '📚 Study' : cat === 'Personal' ? '🏠 Personal' : '🌐 General'}
            </button>
          ))}
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filteredTasks.map(t => (
            <li key={t.id} style={{ background: isDarkMode ? '#1e293b' : '#f8fafc', padding: '12px', marginBottom: '8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `5px solid ${getCategoryColor(t.category)}`, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderTop: isDarkMode ? 'none' : '1px solid #e2e8f0', borderRight: isDarkMode ? 'none' : '1px solid #e2e8f0', borderBottom: isDarkMode ? 'none' : '1px solid #e2e8f0' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, marginRight: '10px' }}>
                {editingId === t.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#000' }} />
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <input type="datetime-local" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#000', flex: 1 }} />
                      <button onClick={() => handleEditSave(t.id)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span style={{ textDecoration: t.status === 'completed' ? 'line-through' : 'none', color: t.status === 'completed' ? '#94a3b8' : (isDarkMode ? '#fff' : '#1e293b'), cursor: 'pointer', fontSize: '16px', wordBreak: 'break-all' }} onClick={() => toggleTask(t.id)}>
                      {t.task} {t.status === 'completed' ? '✅' : '⏳'}
                    </span>
                    {t.due_date && (
                      <span style={{ fontSize: '12px', color: '#f87171', fontWeight: '500' }}>
                        {formatDueDate(t.due_date)}
                      </span>
                    )}
                  </>
                )}
                <span style={{ fontSize: '11px', background: getCategoryColor(t.category), color: '#fff', padding: '2px 8px', borderRadius: '10px', width: 'fit-content', fontWeight: '500', marginTop: '3px' }}>
                  {t.category}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {editingId !== t.id && (
                  <button onClick={() => startEdit(t.id, t.task, t.due_date)} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: '16px' }}>✏️</button>
                )}
                <button onClick={() => deleteTask(t.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>❌</button>
              </div>

            </li>
          ))}
        </ul>

        {filteredTasks.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginTop: '20px' }}>No tasks found! 🎈</p>
        )}

      </div>
    </div>
  );
}

export default Home;