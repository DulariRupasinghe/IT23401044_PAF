import React, { useState, useEffect } from "react";
import ResourceList from "./components/ResourceList";
import NotificationPanel from "./components/NotificationPanel";
import DashboardStats from "./components/DashboardStats";
import AnalyticsView from "./components/AnalyticsView";
import NotificationSettings from "./components/NotificationSettings";
import { LayoutDashboard, Building2, Bell, Settings, User, Search, LogOut, Sun, Moon, BarChart3, ShieldCheck, GraduationCap, ChevronDown } from 'lucide-react';
import * as api from "./services/api";
import "./index.css";

function App() {
  const [resources, setResources] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  const [isDark, setIsDark] = useState(false);
  const [role, setRole] = useState('ADMIN');
  
  const [preferences, setPreferences] = useState({
    SYSTEM: true,
    MAINTENANCE: true,
    BOOKING: true,
    SECURITY: true
  });

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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      if (isDark) {
          document.body.classList.add('dark');
      } else {
          document.body.classList.remove('dark');
      }
  }, [isDark]);

  useEffect(() => {
    if (role === 'STUDENT') setActiveTab('facilities');
    else setActiveTab('analytics');
  }, [role]);

  return (
    <div className={`app-container ${isDark ? 'dark' : ''}`}>
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '10px' }}>
            <Building2 size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>SmartHub</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {role === 'ADMIN' && (
            <button 
              className="btn" 
              style={{ 
                  background: activeTab === 'analytics' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', 
                  color: activeTab === 'analytics' ? 'var(--primary)' : 'var(--text-muted)', 
                  width: '100%', justifyContent: 'flex-start' 
              }}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={20} /> Analytics
            </button>
          )}
          
          <button 
            className="btn" 
            style={{ 
                background: activeTab === 'facilities' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', 
                color: activeTab === 'facilities' ? 'var(--primary)' : 'var(--text-muted)', 
                width: '100%', justifyContent: 'flex-start' 
            }}
            onClick={() => setActiveTab('facilities')}
          >
            <Building2 size={20} /> {role === 'ADMIN' ? 'Facilities' : 'Catalogue'}
          </button>

          <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--text-muted)' }} onClick={() => setIsNotifOpen(true)}>
            <Bell size={20} /> Notifications
          </button>

          <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--text-muted)' }} onClick={() => setIsSettingsOpen(true)}>
            <Settings size={20} /> Preferences
          </button>
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <button className="btn" style={{ width: '100%', justifyContent: 'center', background: 'var(--bg-main)', border: '1px solid var(--border)' }} onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />} {isDark ? 'Light' : 'Dark'}
          </button>
          <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--error)' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 style={{ fontSize: '1.8rem' }}>
                {role === 'ADMIN' ? (activeTab === 'analytics' ? 'Admin Dashboard' : 'Facility Management') : 'Campus Catalogue'}
            </h1>
            <p className="text-muted">Smart-Campus Hub • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Role Switcher */}
            <div className="glass" style={{ display: 'flex', padding: '4px', borderRadius: '12px', background: 'var(--bg-main)' }}>
                <button 
                    className="btn" 
                    style={{ 
                        padding: '0.4rem 1rem', 
                        fontSize: '0.8rem', 
                        background: role === 'ADMIN' ? 'var(--primary)' : 'transparent',
                        color: role === 'ADMIN' ? 'white' : 'var(--text-muted)',
                        borderRadius: '8px'
                    }}
                    onClick={() => setRole('ADMIN')}
                >
                    <ShieldCheck size={14} /> Admin
                </button>
                <button 
                    className="btn" 
                    style={{ 
                        padding: '0.4rem 1rem', 
                        fontSize: '0.8rem', 
                        background: role === 'STUDENT' ? 'var(--primary)' : 'transparent',
                        color: role === 'STUDENT' ? 'white' : 'var(--text-muted)',
                        borderRadius: '8px'
                    }}
                    onClick={() => setRole('STUDENT')}
                >
                    <GraduationCap size={14} /> Student
                </button>
            </div>

            <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '12px' }}>
              <Search size={18} color="var(--text-muted)" />
              <input type="text" placeholder="Search operations..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: 'var(--text-main)' }} />
            </div>

            <button className="btn-icon" onClick={() => setIsNotifOpen(true)} style={{ position: 'relative' }}>
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', background: 'var(--error)', borderRadius: '50%', border: '2px solid white' }}></span>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {role === 'ADMIN' ? <User size={20} /> : <GraduationCap size={20} />}
              </div>
              <div style={{ cursor: 'pointer' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {role === 'ADMIN' ? 'Admin Portal' : 'Student Access'} <ChevronDown size={12} />
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{role === 'ADMIN' ? 'Full Access' : 'View Only'}</p>
              </div>
            </div>
          </div>
        </header>

        <DashboardStats resources={resources} notifications={notifications} role={role} />
        
        {role === 'ADMIN' && activeTab === 'analytics' ? (
            <AnalyticsView resources={resources} notifications={notifications} />
        ) : (
            <ResourceList initialResources={resources} refreshData={fetchData} role={role} />
        )}
      </main>

      <NotificationPanel 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        notifications={notifications} 
        refreshNotifs={fetchData}
      />

      <NotificationSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        preferences={preferences}
        setPreferences={setPreferences}
      />
    </div>
  );
}

export default App;




