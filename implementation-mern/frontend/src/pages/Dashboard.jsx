import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Users, 
    BookOpen, 
    CheckCircle, 
    AlertCircle,
    TrendingUp,
    Calendar
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalModules: 0,
        averageAttendance: 0,
        eligibleModules: 0,
        recentActivity: []
    });

    useEffect(() => {
        // Fetch real stats here
        // For now, setting realistic placeholders for demonstration
        setStats({
            totalModules: 5,
            averageAttendance: 82,
            eligibleModules: 4,
            recentActivity: [
                { id: 1, action: 'Attendance Marked', module: 'CS301', date: 'Today 10:30 AM' },
                { id: 2, action: 'Feedback Submitted', module: 'MA202', date: 'Yesterday' },
                { id: 3, action: 'Attendance Marked', module: 'CS302', date: '2 days ago' },
            ]
        });
    }, []);

    return (
        <div className="dashboard-page">
            <div className="header-action">
                <div>
                    <h1>Welcome back, {user?.name}</h1>
                    <p className="text-muted">Here is your academic overview for today.</p>
                </div>
                <div className="date-badge card">
                    <Calendar size={18} />
                    <span>{new Date().toDateString()}</span>
                </div>
            </div>

            <div className="grid-3">
                <div className="card stat-card">
                    <div className="stat-icon blue">
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="label">Enrolled Modules</p>
                        <p className="value">{stats.totalModules}</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon green">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="label">Avg. Attendance</p>
                        <p className="value">{stats.averageAttendance}%</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon orange">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="label">Eligible Modules</p>
                        <p className="value">{stats.eligibleModules}/{stats.totalModules}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-sections grid-2">
                <div className="card section-card">
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                        {stats.recentActivity.map(item => (
                            <div key={item.id} className="activity-item">
                                <div className="activity-dot"></div>
                                <div className="activity-info">
                                    <p className="action">{item.action}</p>
                                    <p className="module">{item.module} • {item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card section-card">
                    <h3>Academic Progress</h3>
                    <div className="progress-content">
                        <div className="progress-info">
                            <span>Attendance Threshold (75%)</span>
                            <span>{stats.averageAttendance}%</span>
                        </div>
                        <div className="progress-bar-container">
                            <div 
                                className="progress-bar" 
                                style={{ width: `${stats.averageAttendance}%`, backgroundColor: stats.averageAttendance >= 75 ? '#22c55e' : '#f59e0b' }}
                            ></div>
                        </div>
                        <p className="mt-4 text-muted small">
                            {stats.averageAttendance >= 75 
                                ? "You are currently eligible for all examinations. Keep it up!" 
                                : "You are below the 75% threshold in some modules. Check details in Analytics."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
