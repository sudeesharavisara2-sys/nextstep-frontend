import React from "react";
import { useNavigate } from "react-router-dom";
import "./StallBooking.css";

export default function HowToBook() {
  const navigate = useNavigate();

  return (
    <div className="stall-booking-page">
      {/* TOP NAVBAR */}
      <div className="top-navbar">
        <div className="nav-logo">NEXTSTEP</div>
        <div className="nav-links">
          <span onClick={() => navigate("/dashboard")}>Home</span>
          <span className="active">How to Book</span>
          <span onClick={() => navigate("/stalls/my-bookings")}>
            My Bookings
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="booking-card">
        <h1>How to Book a Stall</h1>
        <p className="subtitle">
          Follow these simple steps to book your stall easily
        </p>

        <div className="howto-steps">
          <div className="howto-step">
            <h3>1️⃣ View Available Stalls</h3>
            <p>
              Go to <b>Available Stalls</b>, browse through the stalls and
              check price, location and capacity.
            </p>
          </div>

          <div className="howto-step">
            <h3>2️⃣ Book Your Stall</h3>
            <p>
              Click <b>Book This Stall</b>, fill in your details, date, time
              and duration.
            </p>
          </div>

          <div className="howto-step">
            <h3>3️⃣ Confirm Booking</h3>
            <p>
              Click <b>Confirm Booking</b>. Your booking will appear in
              <b> My Bookings</b>.
            </p>
          </div>

          <div className="howto-step">
            <h3>4️⃣ Manage Bookings</h3>
            <p>
              View, edit or delete your bookings anytime from
              <b> My Bookings</b>.
            </p>
          </div>
        </div>

        <button
          className="confirm-btn"
          onClick={() => navigate("/stalls/available")}
        >
          View Available Stalls
        </button>
      </div>
    </div>
  );
}
