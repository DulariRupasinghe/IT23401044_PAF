import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [email] = useState("student@example.com"); // Placeholder email
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [email]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/notifications/${email}`);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/api/notifications/${id}`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, status: "read" } : n));
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`http://localhost:8080/api/notifications/user/${email}/read-all`);
      setNotifications(notifications.map(n => ({ ...n, status: "read" })));
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="notification-panel">
      <h3>Notifications</h3>
      <button onClick={markAllAsRead}>Mark all as read</button>
      
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((n) => (
            <li 
              key={n.id} 
              style={{ 
                padding: "10px", 
                border: "1px solid #ddd", 
                marginBottom: "5px",
                backgroundColor: n.status === "unread" ? "#f9f9f9" : "white",
                borderLeft: n.status === "unread" ? "4px solid blue" : "1px solid #ddd"
              }}
            >
              <div><strong>{n.title}</strong></div>
              <div>{n.message}</div>
              <div style={{ fontSize: "0.8em", color: "#666" }}>{n.type}</div>
              <div style={{ marginTop: "5px" }}>
                {n.status === "unread" && (
                  <button onClick={() => markAsRead(n.id)} style={{ marginRight: "5px" }}>Read</button>
                )}
                <button onClick={() => deleteNotification(n.id)} style={{ color: "red" }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .notification-panel {
          margin: 20px 0;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        button {
          padding: 5px 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
