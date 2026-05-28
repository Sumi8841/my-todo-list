import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/signup', { username, email, password });
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ background: '#1e293b', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#334155', padding: '30px', borderRadius: '10px', width: '300px' }}>
        <h2 style={{ textAlign: 'center' }}>Sign Up 🚀</h2>
        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none' }} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none' }} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none' }} required />
          <button type="submit" style={{ padding: '10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Register</button>
        </form>
      </div>
    </div>
  );
}
export default SignUp;