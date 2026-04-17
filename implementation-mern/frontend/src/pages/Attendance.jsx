import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { QrCode, Camera, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const Attendance = () => {
    const { user } = useAuth();
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState('');
    const [qrCode, setQrCode] = useState(null);
    const [sessionExpiry, setSessionExpiry] = useState(null);
    const [markingStatus, setMarkingStatus] = useState(null); // 'success', 'error', 'scanning'
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/modules', config);
                setModules(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchModules();
    }, [user.token]);

    // Lecturer: Generate QR
    const handleGenerateQR = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('http://localhost:5000/api/attendance/session', {
                moduleId: selectedModule,
                durationMinutes: 5
            }, config);
            setQrCode(data.qrCode);
            setSessionExpiry(new Date(data.expiresAt));
        } catch (err) {
            console.error(err);
        }
    };

    // Student: Start Scanner
    const startScanner = () => {
        setMarkingStatus('scanning');
        const scanner = new Html5QrcodeScanner("reader", { 
            fps: 10, 
            qrbox: { width: 250, height: 250 } 
        });

        scanner.render(async (decodedText) => {
            scanner.clear();
            try {
                const qrData = JSON.parse(decodedText);
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.post('http://localhost:5000/api/attendance/mark', {
                    sessionId: qrData.sessionId,
                    token: qrData.token
                }, config);
                
                setMarkingStatus('success');
                setStatusMessage('Attendance marked successfully!');
            } catch (err) {
                setMarkingStatus('error');
                setStatusMessage(err.response?.data?.message || 'Failed to mark attendance');
            }
        }, (err) => {
            // console.warn(err);
        });
    };

    return (
        <div className="attendance-page">
            <div className="header-action">
                <h1>Attendance Hub</h1>
                <p>Digital QR-based student attendance system</p>
            </div>

            <div className="grid-2">
                {/* LECTURER VIEW: Generate QR */}
                {user.role === 'Lecturer' && (
                    <div className="card attendance-card">
                        <div className="card-header">
                            <QrCode className="text-primary" />
                            <h3>Generate Lecture QR</h3>
                        </div>
                        <div className="form-group mt-4">
                            <label>Select Module</label>
                            <select 
                                value={selectedModule} 
                                onChange={(e) => setSelectedModule(e.target.value)}
                            >
                                <option value="">Select a module...</option>
                                {modules.map(mod => (
                                    <option key={mod._id} value={mod._id}>{mod.name} ({mod.code})</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            className="btn btn-primary w-full mt-4" 
                            onClick={handleGenerateQR}
                            disabled={!selectedModule}
                        >
                            Generate Session QR
                        </button>

                        {qrCode && (
                            <div className="qr-container mt-6">
                                <img src={qrCode} alt="Attendance QR" className="qr-image" />
                                <div className="session-timer mt-4">
                                    <Clock size={16} />
                                    <span>Expires at: {sessionExpiry?.toLocaleTimeString()}</span>
                                </div>
                                <p className="text-muted small mt-2">Students should scan this code now.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* STUDENT VIEW: Scan QR */}
                {user.role === 'Student' && (
                    <div className="card attendance-card">
                        <div className="card-header">
                            <Camera className="text-primary" />
                            <h3>Scan Lecture QR</h3>
                        </div>
                        
                        {markingStatus !== 'scanning' && markingStatus !== 'success' && (
                            <div className="scan-placeholder mt-6">
                                <div className="scan-icon-bg">
                                    <QrCode size={48} className="text-secondary" />
                                </div>
                                <p className="mt-4">Scan the QR code displayed by your lecturer to mark attendance.</p>
                                <button className="btn btn-primary mt-6" onClick={startScanner}>
                                    Open Camera Scanner
                                </button>
                            </div>
                        )}

                        <div id="reader" className="mt-4"></div>

                        {markingStatus === 'success' && (
                            <div className="status-message success mt-6">
                                <CheckCircle2 size={48} />
                                <h4>Success!</h4>
                                <p>{statusMessage}</p>
                                <button className="btn btn-primary mt-4" onClick={() => setMarkingStatus(null)}>
                                    Done
                                </button>
                            </div>
                        )}

                        {markingStatus === 'error' && (
                            <div className="status-message error mt-6">
                                <AlertCircle size={48} />
                                <h4>Oops!</h4>
                                <p>{statusMessage}</p>
                                <button className="btn btn-primary mt-4" onClick={() => setMarkingStatus(null)}>
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Info Card */}
                <div className="card info-card bg-primary-light">
                    <h3>How it works</h3>
                    <ul className="info-list mt-4">
                        <li>Lecturers generate a unique session QR for the current lecture.</li>
                        <li>QR codes are time-limited (5-10 mins) to prevent fraud.</li>
                        <li>Students must scan the real-time code to be marked <b>Present</b>.</li>
                        <li>Attendance is automatically calculated for eligibility threshold (75%).</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
