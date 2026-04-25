import React from 'react';
import { Building2, AlertTriangle, Users, CheckCircle2, BookmarkCheck, Calendar } from 'lucide-react';

export default function DashboardStats({ resources, notifications, role }) {
  const isAdmin = role === 'ADMIN';
  
  const totalResources = resources.length;
  const activeResources = resources.filter(r => r.status === 'ACTIVE').length;
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const totalCapacity = resources.reduce((sum, r) => sum + r.capacity, 0);

  const stats = isAdmin ? [
    { label: 'Total Facilities', value: totalResources, icon: <Building2 />, color: 'var(--primary)' },
    { label: 'Operational', value: activeResources, icon: <CheckCircle2 />, color: 'var(--secondary)' },
    { label: 'System Alerts', value: unreadNotifications, icon: <AlertTriangle />, color: 'var(--error)' },
    { label: 'Total Capacity', value: totalCapacity, icon: <Users />, color: 'var(--accent)' },
  ] : [
    { label: 'Available Now', value: activeResources, icon: <CheckCircle2 />, color: 'var(--secondary)' },
    { label: 'My Notifications', value: unreadNotifications, icon: <BookmarkCheck />, color: 'var(--primary)' },
    { label: 'Upcoming Bookings', value: 0, icon: <Calendar />, color: 'var(--accent)' },
    { label: 'Campus Capacity', value: totalCapacity, icon: <Users />, color: 'var(--text-muted)' },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => (
        <div key={idx} className="card stat-card glass animate-in" style={{ animationDelay: `${idx * 0.1}s` }}>
          <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
            {stat.icon}
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{stat.label}</p>
            <h3 style={{ fontSize: '1.5rem', marginTop: '0.2rem' }}>{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
