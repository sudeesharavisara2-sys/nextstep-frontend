// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- Auth ---
import Signup from "./components/Auth/Signup";
import VerifyOTP from "./components/Auth/VerifyOTP";
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

// --- Stall Booking ---
import AvailableStalls from "./components/stallbooking/AvailableStalls";
import BookStall from "./components/stallbooking/BookStall";
import MyBookings from "./components/stallbooking/MyBookings";
import HowToBook from "./components/stallbooking/HowToBook";
import StallHome from "./components/stallbooking/StallHome";

// --- Study Rooms ---
import StudyRoomBooking from "./components/StudyRoom/StudyRoomBooking";
import StudyRoomAdmin from "./components/StudyRoom/StudyRoomAdmin";

// --- Model Papers ---
import ModelPapersUser from "./components/ModelPapers/ModelPapersUser";
import ModelPapers from "./components/ModelPapers/ModelPapers";

// --- Styles ---
import "./styles/App.css";
import "./components/stallbooking/stallbooking.css";


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
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* USER ROUTES */}
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/shuttle-service" element={<RequireAuth><ShuttleService /></RequireAuth>} />
        <Route path="/study-rooms" element={<RequireAuth><StudyRoomBooking /></RequireAuth>} />
        <Route path="/model-papers" element={<RequireAuth><ModelPapersUser /></RequireAuth>} />

        {/* Stall Booking */}
        <Route path="/stalls" element={<RequireAuth><StallHome /></RequireAuth>} />
        <Route path="/stalls/available" element={<RequireAuth><AvailableStalls /></RequireAuth>} />
        <Route path="/stalls/book" element={<RequireAuth><BookStall /></RequireAuth>} />
        <Route path="/stalls/my-bookings" element={<RequireAuth><MyBookings /></RequireAuth>} />
        <Route path="/stalls/how-to-book" element={<RequireAuth><HowToBook /></RequireAuth>} />

        {/* Club Events */}
        <Route path="/club-events" element={<RequireAuth><ClubEvents /></RequireAuth>} />
        <Route path="/admin/club-requests" element={<RequireAdmin><AdminClubRequests /></RequireAdmin>} />

        {/* ADMIN ROUTES */}
        <Route path="/admin-dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/add-shuttle" element={<RequireAdmin><AddShuttle /></RequireAdmin>} />
        <Route path="/admin-study-rooms" element={<RequireAdmin><StudyRoomAdmin /></RequireAdmin>} />
        <Route path="/manage-model-papers" element={<RequireAdmin><ModelPapers /></RequireAdmin>} />

        {/* Placeholder pages */}
        <Route path="/core-system" element={<RequireAuth><div>Core System Page</div></RequireAuth>} />
        <Route path="/lost-found" element={<RequireAuth><div>Lost & Found Page</div></RequireAuth>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
