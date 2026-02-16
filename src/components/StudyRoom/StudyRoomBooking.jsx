import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "../../styles/Dashboard.css";
// ✅ Import the logo as used in your other file
import logo from "../../assets/logo1.png";

const StudyRoomBooking = () => {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");

  // ✅ MUST match backend rooms list
  const ROOMS = useMemo(() => ["A1", "A2", "A3", "B1", "B2", "C1", "C2", "C3"], []);

  const [formData, setFormData] = useState({
    room: "",
    date: "",
    time: "", // HH:mm
    durationMinutes: 60,
  });

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Guard + initial load
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMyBookings();
  }, [token, navigate]);

  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const getErrorMessage = (err, fallback) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.Error ||
      err?.response?.data?.error ||
      fallback
    );
  };

  // 🔄 Load bookings
  const fetchMyBookings = async () => {
    try {
      const res = await API.get("/study-room/my-bookings", authHeaders);
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) navigate("/login");
      setBookings([]);
    }
  };

  // 📥 Form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "durationMinutes") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📤 Book room
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.room) {
      setMessage("❗ Please select a room");
      return;
    }

    setLoading(true);
    try {
      await API.post("/study-room/book", formData, authHeaders);
      setMessage("✅ Room booked successfully");
      setFormData({ room: "", date: "", time: "", durationMinutes: 60 });
      fetchMyBookings();
    } catch (err) {
      console.error(err);
      setMessage(getErrorMessage(err, "❌ Booking failed"));
    } finally {
      setLoading(false);
    }
  };

  // ❌ Cancel booking
  const handleCancel = async (id) => {
    setMessage("");
    const ok = window.confirm("Cancel this booking?");
    if (!ok) return;

    try {
      await API.patch(`/study-room/bookings/${id}/cancel`, null, authHeaders);
      setMessage("✅ Booking cancelled");
      fetchMyBookings();
    } catch (err) {
      console.error(err);
      setMessage(getErrorMessage(err, "❌ Cancel failed"));
      if (err?.response?.status === 401) navigate("/login");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* ✅ UPDATED SIDEBAR SECTION */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="NextStep Logo" className="logo-img" />
        </div>
        <ul className="menu-list">
          <li className="menu-item" onClick={() => navigate('/dashboard')}>
            Home
          </li>
          <li className="menu-item active">
            Study Room Booking
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="shuttle-header">
          <h1>📚 Study Room Booking</h1>
          <p>Reserve a quiet space for your academic needs.</p>
        </header>

        {/* BOOK FORM */}
        <div className="info-card" style={{ maxWidth: "520px", marginBottom: "30px" }}>
          <h3>Book a Study Room</h3>
          <form onSubmit={handleSubmit} className="auth-form">
            <select
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Select Room --</option>
              {ROOMS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

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

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Booking..." : "Book Room"}
            </button>
          </form>
          {message && <p style={{ marginTop: "10px", color: message.includes('✅') ? '#4ade80' : '#ff4d4d' }}>{message}</p>}
        </div>

        {/* BOOKINGS LIST */}
        <div className="bookings-section">
          <h2 style={{ marginBottom: "20px" }}>My Bookings</h2>
          <div className="dashboard-cards">
            {bookings.length === 0 && <p>No bookings yet</p>}

            {bookings.map((b) => (
              <div key={b.id} className="info-card" style={{ textAlign: 'left' }}>
                <h3 style={{ color: '#88e3b5' }}>Room: {b.room}</h3>
                <p><strong>Date:</strong> {b.date}</p>
                <p>
                  <strong>Time:</strong> {b.startTime} - {b.endTime} ({b.durationMinutes} mins)
                </p>
                <p><strong>Status:</strong> <span style={{ color: b.status === "ACTIVE" ? "#4ade80" : "#ff4d4d" }}>{b.status}</span></p>

                {b.status === "ACTIVE" && (
                  <button
                    className="card-call-action"
                    style={{ marginTop: "15px", border: 'none', cursor: 'pointer', background: '#dc3545' }}
                    onClick={() => handleCancel(b.id)}
                  >
                    Cancel Booking
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