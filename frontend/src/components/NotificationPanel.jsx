import React, { useState, useEffect, useCallback } from "react";
import * as notificationApi from "../services/api";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await notificationApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all read", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  if (loading) return <div className="card">Loading campus alerts...</div>;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="card notification-panel">
      <div className="header-section">
        <h3>
          Campus Notifications Hub
          {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
        </h3>
        {unreadCount > 0 && (
            <button className="btn btn-primary" onClick={handleMarkAllRead}>
              Mark All as Read
            </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
            <p>You're all caught up! No new alerts.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((n) => (
            <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
              <div className="notif-header">
                <span className="title">{n.title}</span>
                <span className="time">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="message">{n.message}</p>
              <div className="footer">
                <span className={`badge-type ${n.type.toLowerCase()}`}>{n.type}</span>
                <div className="actions">
                    {!n.read && (
                        <button className="btn-small" onClick={() => handleMarkAsRead(n.id)}>Mark Read</button>
                    )}
                    <button className="btn-small btn-delete" onClick={() => handleDelete(n.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
