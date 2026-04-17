import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User as UserIcon, Plus } from 'lucide-react';
import axios from 'axios';

const Modules = () => {
    const { user } = useAuth();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/modules', config);
                setModules(data);
            } catch (error) {
                console.error('Error fetching modules', error);
                // Placeholder modules for demonstration if API fails or is empty
                setModules([
                    { _id: '1', code: 'CS301', name: 'Software Engineering', lecturer: { name: 'Dr. Smith' }, department: 'CS' },
                    { _id: '2', code: 'CS302', name: 'Database Systems', lecturer: { name: 'Dr. Jones' }, department: 'CS' },
                ]);
            }
            setLoading(false);
        };
        fetchModules();
    }, [user.token]);

    return (
        <div className="modules-page">
            <div className="header-action">
                <h1>Academic Modules</h1>
                {user.role === 'Admin' && (
                    <button className="btn btn-primary">
                        <Plus size={18} /> Add Module
                    </button>
                )}
            </div>

            <div className="grid-3">
                {modules.map(module => (
                    <div key={module._id} className="card module-card">
                        <div className="module-header">
                            <span className="module-code">{module.code}</span>
                            <BookOpen size={20} className="text-muted" />
                        </div>
                        <h3>{module.name}</h3>
                        <div className="module-footer">
                            <div className="lecturer-info">
                                <UserIcon size={14} />
                                <span>{module.lecturer?.name}</span>
                            </div>
                            <span className="dept-tag">{module.department}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Modules;
