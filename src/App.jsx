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

// --- Study Room Components ---
import StudyRoomBooking from "./components/StudyRoom/StudyRoomBooking";
import StudyRoomAdmin from "./components/StudyRoom/StudyRoomAdmin";

// --- Model Papers Components ---
import ModelPapersUser from "./components/ModelPapers/ModelPapersUser";
import ModelPapers from "./components/ModelPapers/ModelPapers";

// --- Club Events Components ---
import ClubEventDashboard from "./components/ClubEvents/ClubEventDashBoard";
import AdminClubDashboard from "./components/ClubEvents/AdminClubDashboard";

// --- Lost & Found Components ---
import LostFoundHome from "./components/LostFound/LostFoundHome";
import ItemList from "./components/LostFound/ItemList";
import ReportItem from "./components/LostFound/ReportItem";

// --- Styles ---
import "./styles/App.css";
import "./components/stallbooking/stallbooking.css";

// ---------- Guards ----------
// USER හෝ ADMIN දෙදෙනාටම access
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// ADMIN පමණක්
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
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* USER ROUTES */}
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/shuttle-service" element={<RequireAuth><ShuttleService /></RequireAuth>} />
        <Route path="/study-rooms" element={<RequireAuth><StudyRoomBooking /></RequireAuth>} />
        <Route path="/model-papers" element={<RequireAuth><ModelPapersUser /></RequireAuth>} />

        {/* Stall Booking Routes */}
        <Route path="/stalls" element={<RequireAuth><StallHome /></RequireAuth>} />
        <Route path="/stalls/available" element={<RequireAuth><AvailableStalls /></RequireAuth>} />
        <Route path="/stalls/book" element={<RequireAuth><BookStall /></RequireAuth>} />
        <Route path="/stalls/my-bookings" element={<RequireAuth><MyBookings /></RequireAuth>} />
        <Route path="/stalls/how-to-book" element={<RequireAuth><HowToBook /></RequireAuth>} />

        {/* Club Events Routes */}
        <Route path="/club-events" element={<RequireAuth><ClubEventDashboard /></RequireAuth>} />
        <Route path="/admin-club-events" element={<RequireAdmin><AdminClubDashboard /></RequireAdmin>} />

        {/* Lost & Found Routes - USER සහ ADMIN දෙදෙනාටම */}
        <Route path="/lostfound" element={<RequireAuth><LostFoundHome /></RequireAuth>} />
        <Route path="/lostfound/items" element={<RequireAuth><ItemList /></RequireAuth>} />
        <Route path="/lostfound/report" element={<RequireAuth><ReportItem /></RequireAuth>} />

        {/* Core System */}
        <Route path="/core-system" element={<RequireAuth><div>Core System Page</div></RequireAuth>} />

        {/* ADMIN ROUTES */}
        <Route path="/admin-dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/add-shuttle" element={<RequireAdmin><AddShuttle /></RequireAdmin>} />
        <Route path="/admin-study-rooms" element={<RequireAdmin><StudyRoomAdmin /></RequireAdmin>} />
        <Route path="/manage-model-papers" element={<RequireAdmin><ModelPapers /></RequireAdmin>} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
