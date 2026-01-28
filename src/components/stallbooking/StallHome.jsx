import React from "react";
import { useNavigate } from "react-router-dom";
import NextStepSidebar from "./NextStepSidebar";
import "./StallBooking.css";

export default function StallHome() {
  const navigate = useNavigate();

  return (
    <div className="stall-home-layout">
      {/* LEFT SIDEBAR */}
      <NextStepSidebar />

      {/* RIGHT CONTENT */}
      <div className="stall-home-page">
        <h1>Stall Booking</h1>

        <p className="subtitle">
          Book stalls for campus events, exhibitions, and business activities
          using our easy-to-use online platform.
        </p>

        <div className="action-buttons">
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

        <div className="info-cards">
          <div className="info-card">
            <h3>📋 Easy Booking</h3>
            <p>Reserve stalls in just 3 simple steps.</p>
          </div>

          <div className="info-card">
            <h3>💰 Best Prices</h3>
            <p>Transparent and competitive hourly rates.</p>
          </div>

          <div className="info-card">
            <h3>📍 Smart Locations</h3>
            <p>Prime spots inside campus for maximum reach.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
