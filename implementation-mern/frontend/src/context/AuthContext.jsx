import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        _id: 'dummy_id',
        name: 'Jane Smith',
        email: 'student@edu.com',
        role: 'Admin',
        studentId: 'ST-2024-001',
        department: 'Computer Science',
        token: 'dummy_token',
        avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Bypass stored user for quick demo
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const register = async (userData) => {
        const { data } = await axios.post('http://localhost:5000/api/users', userData);
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
