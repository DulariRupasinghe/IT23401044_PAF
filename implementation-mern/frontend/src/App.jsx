import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Modules from './pages/Modules';
import Attendance from './pages/Attendance';
import Analytics from './pages/Analytics';
import Feedback from './pages/Feedback';
import FAQ from './pages/FAQ';
import UserManagement from './pages/UserManagement';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading EduPortal...</div>;

  return (
    <div className="app-shell">
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/manage-students" element={<UserManagement />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
