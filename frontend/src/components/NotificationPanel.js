import React, { useState, useEffect } from "react";
import * as notificationApi from "../services/api";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [email] = useState("student@example.com"); // Hardcoded for demo/testing
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationApi.getNotifications(email);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Start polling every 10 seconds
    const intervalId = setInterval(fetchNotifications, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [email]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      fetchNotifications(); // Refresh list
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead(email);
      fetchNotifications(); // Refresh list
    } catch (error) {
      console.error("Error marking all read", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      fetchNotifications(); // Refresh list
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="card notification-panel">
      <h3>
        Notifications Hub 
        {notifications.some(n => n.status === 'unread') && (
            <button className="btn btn-primary" onClick={handleMarkAllRead}>Mark All Read</button>
        )}
      </h3>

      {notifications.length === 0 ? (
        <p className="text-muted">No campus alerts found.</p>
      ) : (
        <div className="notification-list">
          {notifications.map((n) => (
            <div key={n.id} className={`notification-item ${n.status === 'unread' ? 'unread' : ''}`}>
              <div className="title">{n.title}</div>
              <div className="message">{n.message}</div>
              <div className="footer">
                <span className="badge">{n.type}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {n.status === 'unread' && (
                        <button className="btn" onClick={() => handleMarkAsRead(n.id)}>Read</button>
                    )}
                    <button className="btn" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(n.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
