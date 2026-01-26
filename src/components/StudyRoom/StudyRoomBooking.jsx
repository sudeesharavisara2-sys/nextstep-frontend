import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "../../styles/Dashboard.css";

const StudyRoomBooking = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    room: "",
    date: "",
    time: "",
  });

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  // 🔐 Protect page
  useEffect(() => {
    if (!token) navigate("/login");
    fetchMyBookings();
  }, []);

  // 🔄 Load bookings
  const fetchMyBookings = async () => {
    try {
      const res = await API.get("/study-room/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 📥 Form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📤 Book room
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/study-room/book", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Room booked successfully");
      setFormData({ room: "", date: "", time: "" });
      fetchMyBookings();
    } catch (err) {
      setMessage("❌ Booking failed");
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">
          <h2>NEXTSTEP</h2>
        </div>
        <button className="menu-item back-btn" onClick={() => navigate("/dashboard")}>
          ⬅ Back
        </button>
      </aside>

      <main className="main-content">
        <header className="top-nav">
          <h1>📚 Study Room Booking</h1>
        </header>

        {/* BOOK FORM */}
        <div className="info-card" style={{ maxWidth: "500px" }}>
          <h3>Book a Study Room</h3>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              name="room"
              placeholder="Room (ex: A1 / Library-2)"
              value={formData.room}
              onChange={handleChange}
              className="form-input"
              required
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />

            <input
              name="time"
              placeholder="Time (ex: 10:00 - 12:00)"
              value={formData.time}
              onChange={handleChange}
              className="form-input"
              required
            />

            <button className="btn-primary">Book Room</button>
          </form>

          {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>

        {/* BOOKINGS LIST */}
        <div style={{ marginTop: "40px" }}>
          <h2>My Bookings</h2>

          <div className="dashboard-cards">
            {bookings.length === 0 && <p>No bookings yet</p>}

            {bookings.map((b) => (
              <div key={b.id} className="info-card">
                <h3>{b.room}</h3>
                <p>Date: {b.date}</p>
                <p>Time: {b.time}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyRoomBooking;
