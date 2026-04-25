import React from "react";
import * as api from "../services/api";
import { X, Bell, Trash2, Check, CheckCircle, Clock } from "lucide-react";

export default function NotificationPanel({ isOpen, onClose, notifications, refreshNotifs }) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await api.markAsRead(id);
      refreshNotifs();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllRead();
      refreshNotifs();
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteNotification(id);
      refreshNotifs();
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 999 }}
        />
      )}

      <div className={`notification-panel ${isOpen ? "open" : ""}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Notifications
              {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>System updates and alerts</p>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {unreadCount > 0 && (
          <button 
            className="btn" 
            style={{ width: '100%', marginBottom: '1.5rem', background: '#f8fafc', border: '1px solid var(--border)', justifyContent: 'center', fontSize: '0.85rem' }}
            onClick={handleMarkAllRead}
          >
            <Check size={16} /> Mark all as read
          </button>
        )}

        <div className="notification-list" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', paddingRight: '0.5rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ width: '64px', height: '64px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--text-muted)' }}>
                <Bell size={32} opacity={0.3} />
              </div>
              <p className="text-muted">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`notification-item ${!n.read ? "unread" : ""}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className={`badge-type ${n.type ? n.type.toLowerCase() : "system"}`}>
                    {n.type || "System"}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {formatTime(n.timestamp)}
                  </span>
                </div>
                
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{n.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', opacity: 0.8, marginBottom: '1rem' }}>{n.message}</p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  {!n.read && (
                    <button className="btn-icon" onClick={() => handleMarkAsRead(n.id)} title="Mark as read">
                      <Check size={14} />
                    </button>
                  )}
                  <button className="btn-icon btn-delete" onClick={() => handleDelete(n.id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

