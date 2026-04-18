import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const getNotifications = (email) => api.get(`/notifications/${email}`);
export const markAsRead = (id) => api.patch(`/notifications/${id}`);
export const markAllAsRead = (email) => api.patch(`/notifications/user/${email}/read-all`);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

export default api;
