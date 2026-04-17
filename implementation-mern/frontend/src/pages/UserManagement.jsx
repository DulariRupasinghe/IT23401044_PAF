import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Users, 
    Plus, 
    Edit2, 
    Trash2, 
    X,
    Save,
    Search,
    AlertCircle
} from 'lucide-react';
import axios from 'axios';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student',
        studentId: '',
        department: '',
        _id: null
    });
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [currentUser.token]);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/users/all', config);
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const validate = () => {
        if (!formData.name || !formData.email || !formData.department) return "Missing required fields";
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) return "Invalid email format";
        if (formData.role === 'Student' && formData.studentId && !/^ST-\d{4}-\d{3}$/.test(formData.studentId)) return "Invalid ID format (ST-YYYY-NNN)";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            if (formData._id) {
                // Update
                await axios.put(`http://localhost:5000/api/users/${formData._id}`, formData, config);
            } else {
                // Create
                await axios.post('http://localhost:5000/api/users', formData, config);
            }
            setIsModalOpen(false);
            resetForm();
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            await axios.delete(`http://localhost:5000/api/users/${id}`, config);
            fetchUsers();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const handleEdit = (user) => {
        setFormData({ ...user, password: '' });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: 'Student', studentId: '', department: '', _id: null });
        setError('');
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="management-page">
            <div className="header-action">
                <div>
                    <h1>Manage Students & Staff</h1>
                    <p>Register, update and manage academic members</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    <Plus size={18} /> Add New Member
                </button>
            </div>

            <div className="card mt-6">
                <div className="search-bar mb-4">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name, email or ID..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name & Profile</th>
                                <th>Role</th>
                                <th>ID / Dept</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => (
                                <tr key={u._id}>
                                    <td>
                                        <div className="user-cell">
                                            <img src={u.avatar} className="avatar-sm" alt="" />
                                            <span>{u.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${u.role === 'Student' ? 'status-eligible' : 'status-ineligible'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div><b>{u.studentId || 'N/A'}</b></div>
                                        <div className="small text-muted">{u.department}</div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn edit" onClick={() => handleEdit(u)}><Edit2 size={16} /></button>
                                            <button className="action-btn delete" onClick={() => handleDelete(u._id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="card modal-content">
                        <div className="modal-header">
                            <h3>{formData._id ? 'Edit Member' : 'Add New Member'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="close-btn"><X size={20} /></button>
                        </div>

                        {error && <div className="error-alert mt-4"><AlertCircle size={16} /> {error}</div>}

                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                                </div>
                            </div>

                            <div className="grid-2 mt-2">
                                <div className="form-group">
                                    <label>Role</label>
                                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                        <option value="Student">Student</option>
                                        <option value="Lecturer">Lecturer</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Department</label>
                                    <input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
                                </div>
                            </div>

                            <div className="grid-2 mt-2">
                                <div className="form-group">
                                    <label>Student ID (Optional for Staff)</label>
                                    <input placeholder="ST-2024-001" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} />
                                </div>
                                {!formData._id && (
                                    <div className="form-group">
                                        <label>Initial Password</label>
                                        <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary w-full mt-6">
                                <Save size={18} /> {formData._id ? 'Save Changes' : 'Register Member'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
