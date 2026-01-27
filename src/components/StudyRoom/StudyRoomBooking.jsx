import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "../../styles/Dashboard.css";

const StudyRoomBooking = () => {
  const navigate = useNavigate();
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    room: "",
    date: "",
    time: "", // HH:mm
    durationMinutes: 60,
  });

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMyBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchMyBookings = async () => {
    try {
      const res = await API.get("/study-room/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) navigate("/login");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "durationMinutes") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/study-room/book", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Room booked successfully");
      setFormData({ room: "", date: "", time: "", durationMinutes: 60 });
      fetchMyBookings();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.Error ||
        "❌ Booking failed";
      setMessage(msg);
    }
  };

  const handleCancel = async (id) => {
    setMessage("");
    try {
      await API.patch(`/study-room/bookings/${id}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Booking cancelled");
      fetchMyBookings();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.Error ||
        "❌ Cancel failed";
      setMessage(msg);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">
          <h2>NEXTSTEP</h2>
        </div>

        <button
          className="menu-item back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Back
        </button>
      </aside>

      <main className="main-content">
        <header className="top-nav">
          <h1>📚 Study Room Booking</h1>
        </header>

        <div className="info-card" style={{ maxWidth: "520px" }}>
          <h3>Book a Study Room</h3>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              name="room"
              placeholder="Room (ex: A1)"
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
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="form-input"
              required
            />

            <select
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              className="form-input"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>120 minutes</option>
              <option value={180}>180 minutes</option>
              <option value={240}>240 minutes</option>
            </select>

            <button className="btn-primary" type="submit">
              Book Room
            </button>
          </form>

          {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>

        <div style={{ marginTop: "40px" }}>
          <h2>My Bookings</h2>

          <div className="dashboard-cards">
            {bookings.length === 0 && <p>No bookings yet</p>}

            {bookings.map((b) => (
              <div key={b.id} className="info-card">
                <h3>{b.room}</h3>
                <p>Date: {b.date}</p>
                <p>
                  Time: {b.startTime} - {b.endTime} ({b.durationMinutes} mins)
                </p>
                <p>Status: {b.status}</p>

                {b.status === "ACTIVE" && (
                  <button
                    className="btn-primary"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleCancel(b.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyRoomBooking;
