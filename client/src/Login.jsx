import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ background: '#1e293b', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#334155', padding: '30px', borderRadius: '10px', width: '300px' }}>
        <h2 style={{ textAlign: 'center' }}>Login 🔒</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none' }} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none' }} required />
          <button type="submit" style={{ padding: '10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '15px', color: '#cbd5e1' }}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;