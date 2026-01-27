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

// --- Study Room Components ---
import StudyRoomBooking from './components/StudyRoom/StudyRoomBooking';
import StudyRoomAdmin from './components/StudyRoom/StudyRoomAdmin';

// --- Styles ---
import './styles/App.css';

// ---------- Guards ----------
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* USER ROUTES */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/study-rooms"
          element={
            <RequireAuth>
              <StudyRoomBooking />
            </RequireAuth>
          }
        />

        <Route
          path="/shuttle-service"
          element={
            <RequireAuth>
              <ShuttleService />
            </RequireAuth>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin-dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin-study-rooms"
          element={
            <RequireAdmin>
              <StudyRoomAdmin />
            </RequireAdmin>
          }
        />

        <Route
          path="/add-shuttle"
          element={
            <RequireAdmin>
              <AddShuttle />
            </RequireAdmin>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
