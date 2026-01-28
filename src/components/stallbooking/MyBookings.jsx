import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StallBooking.css";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("myBookings")) || [];
    setBookings(data);
  }, []);

  const deleteBooking = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("myBookings", JSON.stringify(updated));
  };

  return (
    <div className="dark-bg">
      {/* TOP NAV */}
      <div className="top-navbar">
        <div className="nav-logo">NEXTSTEP</div>
        <div className="nav-links">
          <span onClick={() => navigate("/dashboard")}>Home</span>
          <span onClick={() => navigate("/stalls/available")}>
            Available Stalls
          </span>
          <span className="active">My Bookings</span>
        </div>
      </div>

      <div className="booking-card">
        <h1>My Bookings</h1>

        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="stall-info-box">
              <h2>{b.stall.title}</h2>
              <p><b>Category:</b> {b.stall.category}</p>
              <p><b>Location:</b> {b.stall.location}</p>
              <p><b>Date:</b> {b.date}</p>
              <p><b>Time:</b> {b.slot}</p>
              <p><b>Duration:</b> {b.duration}</p>
              <p className="price">{b.stall.price} / hour</p>

              <div className="action-row">
                <button className="edit-btn">Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => deleteBooking(b.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
