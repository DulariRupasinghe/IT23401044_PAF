import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Bell, 
    CheckCircle, 
    Info, 
    AlertTriangle, 
    XCircle, 
    Trash2, 
    CheckCheck,
    Clock
} from 'lucide-react';
import axios from 'axios';

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, read

    useEffect(() => {
        fetchNotifications();
    }, [user.token]);

    const fetchNotifications = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('http://localhost:5000/api/notifications', config);
            setNotifications(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications', error);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.patch(`http://localhost:5000/api/notifications/${id}`, {}, config);
            setNotifications(notifications.map(n => n._id === id ? { ...n, status: 'read' } : n));
        } catch (error) {
            console.error('Error marking as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.patch('http://localhost:5000/api/notifications/read-all', {}, config);
            setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
        } catch (error) {
            console.error('Error marking all as read', error);
        }
    };

    const deleteNotification = async (id) => {
        if (!window.confirm('Delete this notification?')) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`http://localhost:5000/api/notifications/${id}`, config);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            console.error('Error deleting notification', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-success" size={20} />;
            case 'warning': return <AlertTriangle className="text-warning" size={20} />;
            case 'error': return <XCircle className="text-danger" size={20} />;
            default: return <Info className="text-primary" size={20} />;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return n.status === 'unread';
        if (filter === 'read') return n.status === 'read';
        return true;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return <div className="status-message">Loading notifications...</div>;

    return (
        <div className="notifications-page">
            <div className="header-action">
                <div>
                    <h1>Notifications Hub</h1>
                    <p>Stay updated with campus activities and alerts</p>
                </div>
                {notifications.some(n => n.status === 'unread') && (
                    <button className="btn btn-primary" onClick={markAllAsRead}>
                        <CheckCheck size={18} /> Mark All as Read
                    </button>
                )}
            </div>

            <div className="card mt-6">
                <div className="category-chips mb-4">
                    <button 
                        className={`chip ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({notifications.length})
                    </button>
                    <button 
                        className={`chip ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Unread ({notifications.filter(n => n.status === 'unread').length})
                    </button>
                    <button 
                        className={`chip ${filter === 'read' ? 'active' : ''}`}
                        onClick={() => setFilter('read')}
                    >
                        Read ({notifications.filter(n => n.status === 'read').length})
                    </button>
                </div>

                {filteredNotifications.length === 0 ? (
                    <div className="status-message">
                        <Bell size={48} className="text-muted mb-4" />
                        <p>No notifications found in this category.</p>
                    </div>
                ) : (
                    <div className="notification-list">
                        {filteredNotifications.map(notification => (
                            <div 
                                key={notification._id} 
                                className={`notification-item ${notification.status === 'unread' ? 'unread' : ''}`}
                            >
                                <div className="notification-icon">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="notification-content">
                                    <div className="notification-header">
                                        <h4>{notification.title}</h4>
                                        <span className="timestamp">
                                            <Clock size={12} className="mr-2" />
                                            {formatDate(notification.createdAt)}
                                        </span>
                                    </div>
                                    <p>{notification.message}</p>
                                    <div className="notification-actions">
                                        {notification.status === 'unread' && (
                                            <button 
                                                className="btn-link text-primary"
                                                onClick={() => markAsRead(notification._id)}
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                        <button 
                                            className="btn-link text-danger"
                                            onClick={() => deleteNotification(notification._id)}
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                                {notification.status === 'unread' && <div className="unread-dot"></div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .notification-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .notification-item {
                    display: flex;
                    gap: 1rem;
                    padding: 1.25rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    transition: all 0.2s;
                    position: relative;
                }
                .notification-item.unread {
                    background: #f0f7ff;
                    border-color: #bfdbfe;
                }
                .notification-item:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .notification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                .notification-header h4 {
                    font-size: 1rem;
                    font-weight: 600;
                }
                .timestamp {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                }
                .notification-content {
                    flex: 1;
                }
                .notification-content p {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                }
                .notification-actions {
                    display: flex;
                    gap: 1rem;
                }
                .btn-link {
                    background: transparent;
                    border: none;
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0;
                }
                .btn-link:hover {
                    text-decoration: underline;
                }
                .unread-dot {
                    position: absolute;
                    top: 1.25rem;
                    right: 1.25rem;
                    width: 8px;
                    height: 8px;
                    background: var(--primary);
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default Notifications;
