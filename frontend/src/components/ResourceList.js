import React, { useState, useEffect } from "react";
import * as api from "../services/api";
import { Users, MapPin, Info, Search } from "lucide-react";

export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const { data } = await api.getResources(type, capacity);
      setResources(data);
    } catch (error) {
      console.error("Error fetching resources", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [type, capacity]);

  return (
    <div className="resource-list">
      <div className="header-section" style={{ marginBottom: '2rem' }}>
        <h2>Facilities & Assets Catalogue</h2>
        <p className="text-muted">Manage and monitor campus resources in real-time.</p>
      </div>

      <div className="card filter-bar">
        <div className="filter-group">
          <label>Resource Type</label>
          <select 
            className="input-field" 
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Laboratory</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min Capacity</label>
          <input 
            type="number" 
            className="input-field" 
            placeholder="e.g. 30"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Search size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{resources.length} items found</span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading resources...</div>
      ) : resources.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Info size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>No resources found</h3>
          <p className="text-muted">Try adjusting your filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="resource-grid">
          {resources.map((res) => (
            <div key={res.id} className="card resource-card">
              <div className="header">
                <div>
                  <div className="name">{res.name}</div>
                  <div className="badge" style={{ marginTop: '0.5rem' }}>{res.type.replace('_', ' ')}</div>
                </div>
                <div className={`badge ${res.status === 'ACTIVE' ? 'badge-active' : 'badge-out'}`}>
                  {res.status.replace('_', ' ')}
                </div>
              </div>

              <div className="details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{res.location}</span>
                </div>
                <div className="detail-item">
                  <Users size={16} />
                  <span>Capacity: {res.capacity} students</span>
                </div>
              </div>

              {res.description && (
                <p style={{ fontSize: '0.85rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  {res.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
