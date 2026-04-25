import React from 'react';
import { LayoutGrid, CheckCircle, Bell, Clock } from 'lucide-react';

export default function DashboardStats({ resources, notifications }) {
    const totalResources = resources.length;
    const activeResources = resources.filter(r => r.status === 'ACTIVE').length;
    const unreadNotifications = notifications.filter(n => !n.read).length;

    const stats = [
        {
            label: 'Total Facilities',
            value: totalResources,
            icon: <LayoutGrid size={24} />,
            color: 'var(--primary)',
            bg: '#eef2ff'
        },
        {
            label: 'Active Now',
            value: activeResources,
            icon: <CheckCircle size={24} />,
            color: 'var(--secondary)',
            bg: '#ecfdf5'
        },
        {
            label: 'Unread Alerts',
            value: unreadNotifications,
            icon: <Bell size={24} />,
            color: 'var(--error)',
            bg: '#fef2f2'
        },
        {
            label: 'Operational Uptime',
            value: '99.9%',
            icon: <Clock size={24} />,
            color: 'var(--accent)',
            bg: '#fffbeb'
        }
    ];

    return (
        <div className="stats-grid">
            {stats.map((stat, idx) => (
                <div key={idx} className="card stat-card animate-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{stat.label}</p>
                        <h3 style={{ fontSize: '1.5rem', marginTop: '0.1rem' }}>{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
