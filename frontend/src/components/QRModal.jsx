import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, Calendar, Clock } from 'lucide-react';

export default function QRModal({ isOpen, onClose, resource }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  if (!isOpen || !resource) return null;

  const handleCheckIn = () => {
    setIsVerifying(true);
    // Simulate API delay
    setTimeout(() => {
      setIsVerifying(false);
      setIsCheckedIn(true);
    }, 1500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card animate-in" style={{ width: '400px', padding: '2rem', background: 'var(--surface-elevated)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Access Verification</h3>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {!isCheckedIn ? (
          <>
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', background: 'var(--bg-main)', marginBottom: '1.5rem', display: 'inline-block' }}>
              <QrCode size={120} className={isVerifying ? 'animate-pulse' : ''} style={{ color: 'var(--text-main)' }} />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{resource.name}</h4>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{resource.location}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', marginBottom: '2rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
                <Calendar size={14} className="text-primary" />
                <span>Valid for: {new Date().toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
                <ShieldCheck size={14} className="text-primary" />
                <span>Security Level: Authorized</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', height: '48px' }} 
              onClick={handleCheckIn}
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying Access...' : 'Verify & Check-in'}
            </button>
          </>
        ) : (
          <div className="animate-in" style={{ padding: '2rem 0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={48} />
            </div>
            <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Check-in Successful!</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
              Your access to **{resource.name}** has been verified and recorded.
            </p>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border)' }} onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>

      <style>{`
        .animate-pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}</style>
    </div>
  );
}
