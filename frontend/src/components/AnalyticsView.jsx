import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, Legend } from 'recharts';
import { Timer, Trophy, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

export default function AnalyticsView({ resources, notifications }) {
  // Data preparation for Resource Types
  const typeData = resources.reduce((acc, res) => {
    const existing = acc.find(item => item.name === res.type);
    if (existing) existing.value++;
    else acc.push({ name: res.type, value: 1 });
    return acc;
  }, []);

  // Data preparation for Capacity by Location
  const locationData = resources.reduce((acc, res) => {
    const existing = acc.find(item => item.name === res.location);
    if (existing) existing.capacity += res.capacity;
    else acc.push({ name: res.location, capacity: res.capacity });
    return acc;
  }, []);

  // Mock Alert Trend (SLA Tracking Innovation)
  const alertTrend = [
    { name: 'Mon', active: 4, resolved: 3, avgTime: 12 },
    { name: 'Tue', active: 6, resolved: 5, avgTime: 10 },
    { name: 'Wed', active: 3, resolved: 4, avgTime: 15 },
    { name: 'Thu', active: 8, resolved: 7, avgTime: 8 },
    { name: 'Fri', active: 5, resolved: 6, avgTime: 9 },
  ];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="analytics-view animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* SLA & Performance Header (Innovation 3) */}
      <div className="stats-grid">
        <div className="card glass stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
            <Timer size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Avg. Response Time</p>
            <h3 style={{ fontSize: '1.4rem' }}>12.4m</h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--success)' }}>↓ 14% vs last week</p>
          </div>
        </div>
        <div className="card glass stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Resolution Rate</p>
            <h3 style={{ fontSize: '1.4rem' }}>98.2%</h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--success)' }}>↑ 2% uptime</p>
          </div>
        </div>
        <div className="card glass stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Active Tickets</p>
            <h3 style={{ fontSize: '1.4rem' }}>{notifications.filter(n => !n.read).length}</h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Real-time monitoring</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {/* Asset Distribution */}
        <div className="card glass" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Asset Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Capacity Overview */}
        <div className="card glass" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Capacity by Location</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
              />
              <Bar dataKey="capacity" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Service Performance Trend (Innovation 3) */}
        <div className="card glass" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Service Performance Trend (SLAs)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={alertTrend}>
              <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
              <Area type="monotone" dataKey="avgTime" name="Response Time (min)" stroke="var(--primary)" fillOpacity={1} fill="url(#colorTime)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Utilized Resources (Advanced Metric) */}
        <div className="card glass" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Top Utilized Resources</h3>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '6px' }}>Live Ranking</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
            {resources.slice(0, 5).map((res, i) => (
              <div key={res.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                  #{i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.1rem' }}>{res.name}</h4>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>{res.location}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{85 + i * 2}%</p>
                  <p className="text-muted" style={{ fontSize: '0.7rem' }}>Utilization</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
