<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./components/Auth/Signup";
import VerifyOTP from "./components/Auth/VerifyOTP";
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";

import Dashboard from "./components/Dashboard/Dashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";

import ShuttleService from "./components/Shuttle/ShuttleService";
import AddShuttle from "./components/Shuttle/AddShuttle";

import StudyRoomBooking from "./components/StudyRoom/StudyRoomBooking";

import "./styles/App.css";
=======
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
>>>>>>> 88791749c61f2ad401908b7214a63db9fb5d6b91

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/study-rooms" element={<StudyRoomBooking />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/shuttle-service" element={<ShuttleService />} />
        <Route path="/add-shuttle" element={<AddShuttle />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
=======
      <div className="App">
        <Routes>
          {/* Default Route:  */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* User Routes  */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shuttle-service" element={<ShuttleService />} />

          {/* Admin Routes () */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-shuttle" element={<AddShuttle />} />
          
          {/* Catch-all Route: */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
>>>>>>> 88791749c61f2ad401908b7214a63db9fb5d6b91
    </Router>
  );
}

export default App;
