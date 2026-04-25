import React, { useState, useEffect } from "react";
import * as api from "../services/api";
import { Users, MapPin, Info, Search, Filter, Plus, Building2, Edit2, Trash2 } from "lucide-react";
import ResourceModal from "./ResourceModal";

export default function ResourceList({ initialResources, refreshData }) {
  const [resources, setResources] = useState(initialResources || []);
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(!initialResources);
  const [modalState, setModalState] = useState({ open: false, resource: null });

  const fetchResources = async () => {
    if (!initialResources || type || capacity) {
      setLoading(true);
      try {
        const { data } = await api.getResources(type, capacity);
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchResources();
  }, [type, capacity]);

  useEffect(() => {
    if (initialResources && !type && !capacity) {
        setResources(initialResources);
    }
  }, [initialResources, type, capacity]);

  const handleSave = async (formData) => {
    try {
        if (modalState.resource) {
            await api.updateResource(modalState.resource.id, formData);
        } else {
            await api.createResource(formData);
        }
        setModalState({ open: false, resource: null });
        refreshData();
    } catch (err) {
        console.error("Failed to save resource", err);
    }
  };

  const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this asset?")) {
          try {
              await api.deleteResource(id);
              refreshData();
          } catch (err) {
              console.error("Failed to delete", err);
          }
      }
  };

  return (
    <div className="resource-list animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem' }}>Facilities & Assets</h2>
          <p className="text-muted">Manage campus infrastructure and resource allocation.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalState({ open: true, resource: null })}>
          <Plus size={18} /> Add New Resource
        </button>
      </div>

      <div className="glass card" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
          <Filter size={18} /> Quick Filter:
        </div>

        <div className="filter-group">
          <select 
            className="input-field" 
            style={{ border: 'none', background: 'transparent', fontWeight: 600, color: 'var(--text-main)' }}
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Resource Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Laboratory</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>
        </div>

        <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Min Capacity:</span>
          <input 
            type="number" 
            className="input-field" 
            style={{ border: 'none', background: 'transparent', width: '80px', fontWeight: 600, color: 'var(--text-main)' }}
            placeholder="0"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '8px' }}>
                {resources.length} resources listed
            </span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
            <p className="text-muted">Syncing with database...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="card glass" style={{ textAlign: 'center', padding: '4rem', borderStyle: 'dashed' }}>
          <Info size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No resources match your criteria</h3>
          <p className="text-muted">Try clearing filters or checking different facility types.</p>
          <button className="btn" style={{ marginTop: '1.5rem', border: '1px solid var(--border)' }} onClick={() => { setType(""); setCapacity(""); }}>Reset Filters</button>
        </div>
      ) : (
        <div className="resource-grid">
          {resources.map((res, idx) => (
            <div key={res.id} className="card glass" style={{ animationDelay: `${idx * 0.05}s`, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Building2 size={22} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{res.name}</h4>
                        <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 500 }}>ID: #{res.id.substring(0, 8)}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span className={`badge ${res.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {res.status === 'ACTIVE' ? '● Operational' : '○ Out of Service'}
                    </span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => setModalState({ open: true, resource: res })}><Edit2 size={14} /></button>
                        <button className="btn-icon btn-delete" style={{ width: '28px', height: '28px' }} onClick={() => handleDelete(res.id)}><Trash2 size={14} /></button>
                    </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--bg-main)', borderRadius: '4px', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {res.type.replace('_', ' ')}
                  </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <MapPin size={16} color="var(--text-muted)" />
                  <span style={{ fontWeight: 500 }}>{res.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <Users size={16} color="var(--text-muted)" />
                  <span style={{ fontWeight: 500 }}>Capacity: {res.capacity} Students</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}>View QR</button>
                  <button className="btn btn-primary" style={{ flex: 2, padding: '0.6rem', fontSize: '0.85rem' }}>Manage Facility</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ResourceModal 
        isOpen={modalState.open} 
        onClose={() => setModalState({ open: false, resource: null })} 
        onSave={handleSave} 
        resource={modalState.resource} 
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}


