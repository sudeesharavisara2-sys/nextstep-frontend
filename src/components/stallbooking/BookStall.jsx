import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./StallBooking.css";

export default function StallBooking() {
  const navigate = useNavigate();
  const location = useLocation();

  // Selected stall data (from Available Stalls page)
  const stall = location.state || {
    title: "Food Stall",
    category: "Food & Beverages",
    location: "Main Ground - Area A",
    capacity: 100,
    hours: "09:00 - 21:00",
    price: "RS 1500.00",
  };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event: "",
    date: "",
    slot: "Morning 9AM - 12PM",
    duration: "1 hour",
    requests: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ CONFIRM BOOKING LOGIC
  const handleConfirmBooking = () => {
    const newBooking = {
      id: Date.now(),
      stall,
      ...formData,
    };

    const existingBookings =
      JSON.parse(localStorage.getItem("myBookings")) || [];

    localStorage.setItem(
      "myBookings",
      JSON.stringify([...existingBookings, newBooking])
    );

    // 👉 After booking → My Bookings page
    navigate("/stalls/my-bookings");
  };

  return (
    <div className="stall-booking-page dark-bg">
      {/* TOP NAV BAR */}
      <div className="top-navbar">
        <div className="nav-logo">NEXTSTEP</div>
        <div className="nav-links">
          <span onClick={() => navigate("/dashboard")}>Home</span>
          <span onClick={() => navigate("/stalls/how-to-book")}>
            How to Book
          </span>
          <span onClick={() => navigate("/stalls/my-bookings")}>
            My Bookings
          </span>
        </div>
      </div>

      {/* BOOKING CARD */}
      <div className="booking-card">
        <h1>Book Your Stall</h1>
        <p className="subtitle">
          Secure your perfect spot for campus events
        </p>

        {/* STALL PREVIEW */}
        <div className="stall-info-box">
          <h2>{stall.title}</h2>
          <p><b>Category:</b> {stall.category}</p>
          <p><b>Location:</b> {stall.location}</p>
          <p><b>Capacity:</b> {stall.capacity} people</p>
          <p><b>Available Hours:</b> {stall.hours}</p>
          <p className="price">{stall.price} / hour</p>
        </div>

        {/* BOOKING FORM */}
        <form className="booking-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="event"
            placeholder="Event Name"
            value={formData.event}
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <div className="row">
            <select
              name="slot"
              value={formData.slot}
              onChange={handleChange}
            >
              <option>Morning 9AM - 12PM</option>
              <option>Afternoon 12PM - 4PM</option>
              <option>Evening 4PM - 9PM</option>
            </select>

            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            >
              <option>1 hour</option>
              <option>2 hours</option>
              <option>3 hours</option>
            </select>
          </div>

          <textarea
            name="requests"
            placeholder="Special requests..."
            value={formData.requests}
            onChange={handleChange}
          />

          {/* CONFIRM BUTTON */}
          <button
            type="button"
            className="confirm-btn"
            onClick={handleConfirmBooking}
          >
            Confirm Booking
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/stalls/available")}
          >
            ← Back to Stalls List
          </button>
        </form>
      </div>
    </div>
  );
}
