'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Wrong password. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#fdf6f0',
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px',
        padding: '48px', width: '100%', maxWidth: '400px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.07)',
      }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px' }}>
          Admin Panel
        </h1>
        <p style={{ color: '#999', marginBottom: '32px', fontSize: '0.9rem' }}>
          Enter your password to continue
        </p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '12px 16px', borderRadius: '10px',
              border: '1px solid rgba(0,0,0,0.1)',
              fontSize: '1rem', outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          {error && <p style={{ color: '#e85d5d', fontSize: '0.85rem' }}>{error}</p>}
          <button type="submit" style={{
            background: '#e85d5d', color: '#fff',
            border: 'none', padding: '14px',
            borderRadius: '999px', fontSize: '1rem',
            fontWeight: '600', cursor: 'pointer',
          }}>
            {loading ? 'Checking...' : 'Login →'}
          </button>
        </form>
      </div>
    </div>
  );
}