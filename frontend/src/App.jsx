import React, { useState, useEffect } from "react";
import ResourceList from "./components/ResourceList";
import NotificationPanel from "./components/NotificationPanel";
import DashboardStats from "./components/DashboardStats";
import { LayoutDashboard, Building2, Bell, Settings, User, Search, LogOut } from 'lucide-react';
import * as api from "./services/api";
import "./index.css";

function App() {
  const [resources, setResources] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resData, notifData] = await Promise.all([
        api.getResources(),
        api.getNotifications()
      ]);
      setResources(resData.data);
      setNotifications(notifData.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll for notifications every 30s
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '10px' }}>
            <Building2 size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>SmartHub</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <div className="btn" style={{ background: '#eef2ff', color: 'var(--primary)', width: '100%', justifyContent: 'flex-start' }}>
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--text-muted)' }}>
            <Building2 size={20} /> Facilities
          </div>
          <div className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--text-muted)' }} onClick={() => setIsNotifOpen(true)}>
            <Bell size={20} /> Notifications
          </div>
          <div className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--text-muted)' }}>
            <Settings size={20} /> System Config
          </div>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <div className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--error)' }}>
            <LogOut size={20} /> Logout
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 style={{ fontSize: '1.8rem' }}>Operational Overview</h1>
            <p className="text-muted">Welcome back, Administrator</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px' }}>
              <Search size={18} color="var(--text-muted)" />
              <input type="text" placeholder="Search resources..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }} />
            </div>

            <button className="btn-icon" onClick={() => setIsNotifOpen(true)} style={{ position: 'relative' }}>
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', background: 'var(--error)', borderRadius: '50%', border: '2px solid white' }}></span>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <User size={20} />
              </div>
              <div style={{ display: 'none', md: 'block' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admin User</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <DashboardStats resources={resources} notifications={notifications} />
        
        <ResourceList initialResources={resources} />
      </main>

      <NotificationPanel 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        notifications={notifications} 
        refreshNotifs={fetchData}
      />
    </div>
  );
}

export default App;

