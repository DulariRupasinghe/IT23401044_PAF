import React from 'react';
import { X, Bell, Settings, ShieldCheck, Hammer, BookmarkCheck, Globe } from 'lucide-react';

export default function NotificationSettings({ isOpen, onClose, preferences, setPreferences }) {
  if (!isOpen) return null;

  const categories = [
    { id: 'SYSTEM', label: 'System Updates', desc: 'Core platform updates and downtime alerts.', icon: <Globe size={20} /> },
    { id: 'MAINTENANCE', label: 'Maintenance Alerts', desc: 'Facility repairs and out-of-service notices.', icon: <Hammer size={20} /> },
    { id: 'BOOKING', label: 'Booking Confirmations', desc: 'Updates on your resource reservation status.', icon: <BookmarkCheck size={20} /> },
    { id: 'SECURITY', label: 'Security Alerts', desc: 'Critical campus security and safety notifications.', icon: <ShieldCheck size={20} /> }
  ];

  const handleToggle = (id) => {
    setPreferences({
      ...preferences,
      [id]: !preferences[id]
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card animate-in" style={{ width: '480px', padding: '2rem', background: 'var(--surface-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={22} className="text-primary" />
              Notification Preferences
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Control what alerts you receive.</p>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {categories.map((cat) => (
            <div key={cat.id} className="glass" style={{ padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ color: preferences[cat.id] ? 'var(--primary)' : 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.5rem', borderRadius: '8px' }}>
                  {cat.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>{cat.label}</h4>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>{cat.desc}</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleToggle(cat.id)}
                style={{ 
                  width: '44px', 
                  height: '24px', 
                  borderRadius: '12px', 
                  background: preferences[cat.id] ? 'var(--primary)' : 'var(--border)', 
                  position: 'relative',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
              >
                <div style={{ 
                  width: '18px', 
                  height: '18px', 
                  background: 'white', 
                  borderRadius: '50%', 
                  position: 'absolute', 
                  top: '3px',
                  left: preferences[cat.id] ? '23px' : '3px',
                  transition: 'left 0.3s'
                }} />
              </button>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
          Save Preferences
        </button>
      </div>
    </div>
  );
}
