import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./StallBooking.css";
import logo from "../../assets/logo1.png";

export default function StallHome() {
  const navigate = useNavigate();
  const location = useLocation();

  // Checking whether the user is currently on the main Stall page.
  const isMainPage = location.pathname === "/stalls" || location.pathname === "/stalls/";

  return (
    <div className="dashboard-layout">
      {/* ✅ SIDEBAR SECTION */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="NextStep Logo" className="logo-img" />
        </div>
        <ul className="menu-list">
          <li 
            className={`menu-item ${location.pathname === "/dashboard" ? "active" : ""}`} 
            onClick={() => navigate('/dashboard')}
          >
            Home
          </li>
          <li 
            className={`menu-item ${location.pathname.startsWith("/stalls") ? "active" : ""}`} 
            onClick={() => navigate('/stalls')}
          >
            Stall Booking
          </li>
          <li 
            className="menu-item" 
            onClick={() => navigate('/stalls/my-bookings')}
          >
            My Bookings
          </li>
        </ul>
      </aside>

      {/* ✅ MAIN CONTENT AREA */}
      <main className="main-content">
        {isMainPage ? (
          <div className="stall-welcome-content">
            <header className="shuttle-header">
              <h1>🏪 Stall Booking</h1>
              <p>Book stalls for campus events, exhibitions, and business activities</p>
            </header>

            <div className="action-buttons" style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
              <button
                className="primary-btn"
                onClick={() => navigate("/stalls/available")}
              >
                View Available Stalls →
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/stalls/my-bookings")}
              >
                My Bookings
              </button>
            </div>

            <div className="dashboard-cards" style={{ marginTop: '40px' }}>
              <div className="info-card">
                <div className="card-body">
                  <h3>📋 Easy Booking</h3>
                  <p>Reserve stalls in just 3 simple steps.</p>
                </div>
              </div>
              <div className="info-card">
                <div className="card-body">
                  <h3>💰 Best Prices</h3>
                  <p>Transparent and competitive hourly rates.</p>
                </div>
              </div>
              <div className="info-card">
                <div className="card-body">
                  <h3>📍 Smart Locations</h3>
                  <p>Prime spots inside campus for maximum reach.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="outlet-container">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}