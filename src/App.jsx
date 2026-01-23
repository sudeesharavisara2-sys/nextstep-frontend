import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import VerifyOTP from './VerifyOTP';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard'; 
import ShuttleService from './ShuttleService';
import AddShuttle from './AddShuttle';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shuttle-service" element={<ShuttleService />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-shuttle" element={<AddShuttle />} />
          
          {/* වැරදි URL එකක් ගැසූ විට ලොගින් පිටුවට යැවීම */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;