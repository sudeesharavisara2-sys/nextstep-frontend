import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "../../styles/Dashboard.css";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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

    // small client validation
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

        {/* BOOK FORM */}
        <div className="info-card" style={{ maxWidth: "520px" }}>
          <h3>Book a Study Room</h3>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* ✅ ROOM SELECT */}
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
