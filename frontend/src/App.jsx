import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PatientDashboard } from './pages/PatientDashboard';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { EmergencyHealthCard } from './pages/EmergencyHealthCard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'PATIENT' ? '/patient-dashboard' : '/caregiver-dashboard'} replace />;
  }
  return children;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/patient-dashboard" 
                  element={
                    <ProtectedRoute allowedRole="PATIENT">
                      <PatientDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/caregiver-dashboard" 
                  element={
                    <ProtectedRoute allowedRole="CAREGIVER">
                      <CaregiverDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/emergency/:qrToken" element={<EmergencyHealthCard />} />
                <Route path="/emergency" element={<EmergencyHealthCard />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
