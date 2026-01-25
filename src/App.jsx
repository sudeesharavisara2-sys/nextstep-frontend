import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Auth Components ---
import Signup from './components/Auth/Signup';
import VerifyOTP from './components/Auth/VerifyOTP';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';

// --- Dashboard Components ---
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard'; 

// --- Shuttle Components ---
import ShuttleService from './components/Shuttle/ShuttleService';
import AddShuttle from './components/Shuttle/AddShuttle';

// --- Global Styles ---
// ඔබේ CSS ගොනුව src/styles/App.css හි ඇත්නම්:
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route: වෙබ් අඩවියට පිවිසි විගස Login පිටුවට යොමු කරයි */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* User Routes (ශිෂ්‍යයන් සඳහා) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shuttle-service" element={<ShuttleService />} />

          {/* Admin Routes (පාලකයන් සඳහා) */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-shuttle" element={<AddShuttle />} />
          
          {/* Catch-all Route: වැරදි URL එකක් ගැසූ විට Login පිටුවට යැවීම */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;