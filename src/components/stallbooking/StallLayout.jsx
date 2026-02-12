import React from "react";
import { useNavigate } from "react-router-dom";
import "./StallBooking.css";

const StallLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="stall-layout">
      {/* Top Navbar */}
      <div className="stall-navbar">
        <h2 className="stall-logo">StallBooking</h2>

        <div className="stall-nav-links">
          <button onClick={() => navigate("/stalls")}>Available Stalls</button>
          <button onClick={() => navigate("/stalls/how-to-book")}>
            How to Book
          </button>
          <button onClick={() => navigate("/stalls/my-bookings")}>
            My Bookings
          </button>
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="stall-content">
        {children}
      </div>
    </div>
  );
};

export default StallLayout;
