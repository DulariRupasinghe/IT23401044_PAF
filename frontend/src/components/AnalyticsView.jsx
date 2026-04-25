import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

export default function AnalyticsView({ resources, notifications }) {
  // Data processing for Pie Chart (Resource Types)
  const typeData = Object.entries(
    resources.reduce((acc, res) => {
      acc[res.type] = (acc[res.type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  // Data processing for Bar Chart (Capacity by Location)
  const locationData = Object.entries(
    resources.reduce((acc, res) => {
      acc[res.location] = (acc[res.location] || 0) + res.capacity;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, capacity: value })).slice(0, 5);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'];

  return (
    <div className="analytics-view animate-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
        
        {/* Resource Distribution */}
        <div className="card glass">
          <h3 style={{ marginBottom: '1.5rem' }}>Asset Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Capacity Overview */}
        <div className="card glass">
          <h3 style={{ marginBottom: '1.5rem' }}>Capacity by Location</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} />
                <Bar dataKey="capacity" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Activity (Mocked trend) */}
        <div className="card glass" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>System Alerts Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                {day: 'Mon', alerts: 4}, {day: 'Tue', alerts: 7}, {day: 'Wed', alerts: 3},
                {day: 'Thu', alerts: 9}, {day: 'Fri', alerts: 6}, {day: 'Sat', alerts: 2}, {day: 'Sun', alerts: 1}
              ]}>
                <defs>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="alerts" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAlerts)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
