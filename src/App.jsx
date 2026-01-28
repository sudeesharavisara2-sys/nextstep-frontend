// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- Auth Components ---
import Signup from "./components/Auth/Signup";
import VerifyOTP from "./components/Auth/VerifyOTP";
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";

// --- Lost & Found Components ---
import { LostFound, LostFoundForm, LostFoundList } from "./components/LostFound";

// --- Dashboard Components ---
import Dashboard from "./components/Dashboard/Dashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";

// --- Shuttle Components ---
import ShuttleService from "./components/Shuttle/ShuttleService";
import AddShuttle from "./components/Shuttle/AddShuttle";

// --- Global Styles ---
import "./styles/App.css";

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

          {/* User Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shuttle-service" element={<ShuttleService />} />

          {/* Lost & Found */}
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/lost-found-form" element={<LostFoundForm />} />
          <Route path="/lost-found-list" element={<LostFoundList />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-shuttle" element={<AddShuttle />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
