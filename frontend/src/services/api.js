import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const getNotifications = () => api.get('/notifications');
export const markAsRead = (id) => api.patch(`/notifications/${id}`);
export const markAllRead = () => api.put('/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

export const getResources = (type, capacity) => {
    const params = {};
    if (type) params.type = type;
    if (capacity) params.capacity = capacity;
    return api.get('/resources', { params });
};

export default api;
