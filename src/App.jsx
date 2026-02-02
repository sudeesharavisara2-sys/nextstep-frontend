import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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

// --- Model Paper Components ---
import AdminModelPaper from './components/Modelpaper/AdminModelPaper';
import UserModelPaper from './components/Modelpaper/UserModelPaper';

function App() {
  return (
    <Routes>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* User */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/shuttle-service" element={<ShuttleService />} />
      <Route path="/model-papers" element={<UserModelPaper />} />

      {/* Admin */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-shuttle" element={<AddShuttle />} />
      <Route path="/admin-model-papers" element={<AdminModelPaper />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}

export default App;
