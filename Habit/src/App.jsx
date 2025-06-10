import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Statistics from './components/Statistics';
import TeamManagementPage from './components/TeamManagementPage';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import InvitationPage from './components/InvitationPage';
import Calendar from './components/Calendar';

function App() {
        const userEmail = localStorage.getItem('userEmail');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/statistics" element={<Statistics userEmail={userEmail} />} />
        <Route path="/team" element={<TeamManagementPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/invitation" element={<InvitationPage />} />
        
        {/* Redirect to dashboard if user is logged in */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;