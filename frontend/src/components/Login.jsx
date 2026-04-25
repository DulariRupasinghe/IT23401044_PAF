import React, { useState } from 'react';
import { Building2, ShieldCheck, GraduationCap, ArrowRight, Lock, User } from 'lucide-react';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('ADMIN'); // 'ADMIN' or 'STUDENT'
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin(role);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg-main)',
      backgroundSize: '40px 40px',
      backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)'
    }}>
      <div className="animate-in" style={{ width: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--primary)', 
            color: 'white', 
            borderRadius: '18px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.3)'
          }}>
            <Building2 size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p className="text-muted">Smart-Campus Hub Operations System</p>
        </div>

        <div className="card glass" style={{ padding: '2.5rem', border: '1px solid var(--border)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label className="text-muted" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>SELECT YOUR ROLE</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setRole('ADMIN')}
                style={{ 
                  flex: 1, 
                  padding: '1.25rem', 
                  borderRadius: '16px', 
                  border: `2px solid ${role === 'ADMIN' ? 'var(--primary)' : 'var(--border)'}`,
                  background: role === 'ADMIN' ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <ShieldCheck size={24} color={role === 'ADMIN' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span style={{ fontWeight: 600, color: role === 'ADMIN' ? 'var(--text-main)' : 'var(--text-muted)' }}>Administrator</span>
              </button>
              
              <button 
                onClick={() => setRole('STUDENT')}
                style={{ 
                  flex: 1, 
                  padding: '1.25rem', 
                  borderRadius: '16px', 
                  border: `2px solid ${role === 'STUDENT' ? 'var(--primary)' : 'var(--border)'}`,
                  background: role === 'STUDENT' ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <GraduationCap size={24} color={role === 'STUDENT' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span style={{ fontWeight: 600, color: role === 'STUDENT' ? 'var(--text-main)' : 'var(--text-muted)' }}>Student</span>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Username" 
                defaultValue={role === 'ADMIN' ? 'admin_ops' : 'student_hub'}
                style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', outline: 'none' }} 
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="Password" 
                defaultValue="••••••••"
                style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', outline: 'none' }} 
              />
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1rem' }}
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : (
              <>
                Continue to Dashboard <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
              </>
            )}
          </button>
        </div>

        <p className="text-muted" style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem' }}>
          Secure access managed by **Smart-Campus Infrastructure**
        </p>
      </div>
    </div>
  );
}
