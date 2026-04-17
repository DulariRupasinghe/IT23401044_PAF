import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    QrCode, 
    BarChart3, 
    MessageSquare, 
    MessageCircle, 
    LogOut,
    BookOpen,
    Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Modules', path: '/modules', icon: BookOpen },
        { name: 'Attendance', path: '/attendance', icon: QrCode },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Feedback', path: '/feedback', icon: MessageSquare },
        { name: 'Help/FAQ', path: '/faq', icon: MessageCircle },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">🎓</div>
                <h2>Smart-Campus</h2>
            </div>
            
            <div className="user-profile-small">
                <img src={user?.avatar} alt="avatar" />
                <div className="user-info">
                    <p className="name">{user?.name}</p>
                    <p className="role">{user?.role}</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink 
                        key={item.path} 
                        to={item.path} 
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
                {(user?.role === 'Admin' || user?.role === 'Lecturer') && (
                    <NavLink 
                        to="/manage-students" 
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        <Users size={20} />
                        <span>Manage Students</span>
                    </NavLink>
                )}
            </nav>

{/* Logout disabled for demo */}
        </div>
    );
};

export default Sidebar;
