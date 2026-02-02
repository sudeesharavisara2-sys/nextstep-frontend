// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- Auth ---
import Signup from "./components/Auth/Signup";
import VerifyOTP from "./components/Auth/VerifyOTP"; // ✅ use same component name as file
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

// --- Dashboards ---
import Dashboard from "./components/Dashboard/Dashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";

// --- Club Events ---
import ClubEvents from "./components/ClubEvents/ClubEvents";
import AdminClubRequests from "./components/ClubEvents/AdminClubRequests";

// --- Shuttle ---
import ShuttleService from "./components/Shuttle/ShuttleService";
import AddShuttle from "./components/Shuttle/AddShuttle";

// --- Styles ---
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Login />} />

        {/* Auth */}
        <Route path="/login" element={<Navigate to="/" />} /> {/* ✅ avoid duplicate login page */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Club Events */}
        <Route path="/club-events" element={<ClubEvents />} />
        <Route path="/admin/club-requests" element={<AdminClubRequests />} />

        {/* Shuttle */}
        <Route path="/shuttle-service" element={<ShuttleService />} />
        <Route path="/add-shuttle" element={<AddShuttle />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
