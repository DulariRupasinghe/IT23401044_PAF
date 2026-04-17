import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Download, FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
    const { user } = useAuth();
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState('');
    const [analyticsData, setAnalyticsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data: mods } = await axios.get('http://localhost:5000/api/modules', config);
                setModules(mods);
                
                // For demonstration, let's create a dummy dataset representing multi-module attendance
                setAnalyticsData([
                    { name: 'CS301', attendance: 85, total: 10, attended: 8.5 },
                    { name: 'CS302', attendance: 70, total: 10, attended: 7 },
                    { name: 'MA202', attendance: 92, total: 10, attended: 9.2 },
                    { name: 'CS305', attendance: 65, total: 10, attended: 6.5 },
                    { name: 'ENG101', attendance: 80, total: 10, attended: 8 },
                ]);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchInitialData();
    }, [user.token]);

    const handleDownloadPDF = async (moduleId) => {
        try {
            const config = { 
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            };
            const response = await axios.get(`http://localhost:5000/api/reports/attendance/${moduleId}`, config);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Attendance_Report_${moduleId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert('Module has no records yet or error generating PDF');
        }
    };

    return (
        <div className="analytics-page">
            <div className="header-action">
                <div>
                    <h1>Attendance Analytics</h1>
                    <p>Track eligibility and module-wise performance</p>
                </div>
                {(user.role === 'Lecturer' || user.role === 'Admin') && (
                    <div className="lecturer-actions">
                        <select 
                            value={selectedModule} 
                            onChange={(e) => setSelectedModule(e.target.value)}
                            className="mr-2"
                        >
                            <option value="">Select Module for Report</option>
                            {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                        </select>
                        <button 
                            className="btn btn-primary" 
                            disabled={!selectedModule}
                            onClick={() => handleDownloadPDF(selectedModule)}
                        >
                            <Download size={18} /> Download PDF
                        </button>
                    </div>
                )}
            </div>

            <div className="grid-2">
                <div className="card chart-card">
                    <h3>Eligibility Overview (75% Threshold)</h3>
                    <div className="chart-container" style={{ width: '100%', height: 300, minWidth: 0, marginTop: 20 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="attendance" radius={[4, 4, 0, 0]}>
                                    {analyticsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.attendance >= 75 ? '#22c55e' : '#f43f5e'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="summary-section">
                    <div className="card summary-card border-green">
                        <CheckCircle className="text-success" />
                        <div>
                            <h4>Exam Eligible</h4>
                            <p>3 Modules passed threshold</p>
                        </div>
                    </div>
                    <div className="card summary-card border-red mt-4">
                        <AlertTriangle className="text-danger" />
                        <div>
                            <h4>At Risk</h4>
                            <p>2 Modules below 75%</p>
                        </div>
                    </div>
                    <div className="card info-card bg-primary-light mt-4">
                        <p className="small"><b>Note:</b> Attendance calculations are updated in real-time as lecturers close sessions.</p>
                    </div>
                </div>
            </div>

            <div className="card mt-6">
                <h3>Detailed Module Records</h3>
                <div className="table-responsive mt-4">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Module Code</th>
                                <th>Module Name</th>
                                <th>Lectures Attended</th>
                                <th>Total Lectures</th>
                                <th>Attendance %</th>
                                <th>Eligibility Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analyticsData.map((item, idx) => (
                                <tr key={idx}>
                                    <td><b>{item.name}</b></td>
                                    <td>Academic Module {item.name}</td>
                                    <td>{Math.floor(item.attended)}</td>
                                    <td>{item.total}</td>
                                    <td>{item.attendance}%</td>
                                    <td>
                                        <span className={`status-badge ${item.attendance >= 75 ? 'status-eligible' : 'status-ineligible'}`}>
                                            {item.attendance >= 75 ? 'ELIGIBLE' : 'SHORTAGE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
