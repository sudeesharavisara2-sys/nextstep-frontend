import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- Auth Components ---
import Signup from "./components/Auth/Signup";
import VerifyOTP from "./components/Auth/VerifyOTP";
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";

// --- Dashboard Components ---
import Dashboard from "./components/Dashboard/Dashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";

// --- Shuttle Components ---
import ShuttleService from "./components/Shuttle/ShuttleService";
import AddShuttle from "./components/Shuttle/AddShuttle";

// --- Stall Booking Components ---
import AvailableStalls from "./components/stallbooking/AvailableStalls";
import BookStall from "./components/stallbooking/BookStall";
import MyBookings from "./components/stallbooking/MyBookings";
import HowToBook from "./components/stallbooking/HowToBook";
import StallHome from "./components/stallbooking/StallHome";

// --- Styles ---
import "./styles/App.css";
import "./components/stallbooking/stallbooking.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shuttle-service" element={<ShuttleService />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-shuttle" element={<AddShuttle />} />

          {/* 🔥 Stall Booking Routes (Flat Structure) */}
          <Route path="/stalls" element={<StallHome />} />
          <Route path="/stalls/available" element={<AvailableStalls />} />
          <Route path="/stalls/book" element={<BookStall />} />
          <Route path="/stalls/my-bookings" element={<MyBookings />} />
          <Route path="/stalls/how-to-book" element={<HowToBook />} />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;