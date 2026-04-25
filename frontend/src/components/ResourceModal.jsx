import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function ResourceModal({ isOpen, onClose, onSave, resource }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'LECTURE_HALL',
        capacity: 1,
        location: '',
        status: 'ACTIVE',
        description: ''
    });

    useEffect(() => {
        if (resource) {
            setFormData(resource);
        } else {
            setFormData({
                name: '',
                type: 'LECTURE_HALL',
                capacity: 1,
                location: '',
                status: 'ACTIVE',
                description: ''
            });
        }
    }, [resource, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card animate-in" style={{ width: '500px', padding: '2rem', background: 'var(--surface-elevated)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{resource ? 'Edit Facility' : 'Register New Facility'}</h3>
                    <button className="btn-icon" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="filter-group">
                        <label>Facility Name</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            required
                            style={{ background: 'var(--input-bg)', color: 'var(--text-main)', width: '100%' }}
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="filter-group">
                            <label>Type</label>
                            <select 
                                className="input-field" 
                                style={{ background: 'var(--input-bg)', color: 'var(--text-main)', width: '100%' }}
                                value={formData.type} 
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="LECTURE_HALL">Lecture Hall</option>
                                <option value="LAB">Laboratory</option>
                                <option value="MEETING_ROOM">Meeting Room</option>
                                <option value="EQUIPMENT">Equipment</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Capacity</label>
                            <input 
                                type="number" 
                                className="input-field" 
                                min="1"
                                style={{ background: 'var(--input-bg)', color: 'var(--text-main)', width: '100%' }}
                                value={formData.capacity} 
                                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Location</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            required
                            style={{ background: 'var(--input-bg)', color: 'var(--text-main)', width: '100%' }}
                            value={formData.location} 
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Status</label>
                        <select 
                            className="input-field" 
                            style={{ background: 'var(--input-bg)', color: 'var(--text-main)', width: '100%' }}
                            value={formData.status} 
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="ACTIVE">Operational</option>
                            <option value="OUT_OF_SERVICE">Under Maintenance</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Description (Optional)</label>
                        <textarea 
                            className="input-field" 
                            style={{ background: 'var(--input-bg)', color: 'var(--text-main)', width: '100%', minHeight: '80px', resize: 'none' }}
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border)' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                            <Save size={18} /> {resource ? 'Save Changes' : 'Create Asset'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
