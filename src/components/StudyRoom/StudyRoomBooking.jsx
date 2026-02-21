import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "../../styles/Dashboard.css";   // for dashboard layout, cards, buttons
import "../../styles/StudyRoom.css";   // for status badges, modals, and shared admin styles

const StudyRoomBooking = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  const ROOMS = useMemo(() => ["A1", "A2", "A3", "B1", "B2", "C1", "C2", "C3"], []);

  // Form state
  const [formData, setFormData] = useState({
    room: "",
    date: "",
    time: "",
    durationMinutes: 60,
  });

  // Bookings list
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Availability chart
  const [availability, setAvailability] = useState(null);
  const [fetchingAvailability, setFetchingAvailability] = useState(false);

  // Time slots from 08:00 to 21:00 (1‑hour increments)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 8; h <= 21; h++) {
      const start = `${h.toString().padStart(2, "0")}:00`;
      const end = `${(h + 1).toString().padStart(2, "0")}:00`;
      slots.push({ start, end, label: start });
    }
    return slots;
  }, []);

  const authHeaders = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  // Guard & initial load
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMyBookings();
  }, [token]);

  // Fetch availability when date changes
  useEffect(() => {
    if (!formData.date) return;
    const timer = setTimeout(() => {
      fetchAvailability();
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.date]);

  const fetchMyBookings = async () => {
    try {
      const res = await API.get("/study-room/my-bookings", authHeaders);
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) navigate("/login");
    }
  };

  const fetchAvailability = async () => {
    if (!formData.date) return;
    setFetchingAvailability(true);
    try {
      const res = await API.get("/study-room/availability", {
        ...authHeaders,
        params: { date: formData.date },
      });
      setAvailability(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingAvailability(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "durationMinutes" ? Number(value) : value,
    }));
  };

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
      fetchAvailability();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data || "❌ Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await API.patch(`/study-room/bookings/${id}/cancel`, null, authHeaders);
      setMessage("✅ Booking cancelled");
      fetchMyBookings();
      fetchAvailability();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data || "❌ Cancel failed");
    }
  };

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setEditForm({
      room: booking.room,
      date: booking.date,
      time: booking.startTime,
      durationMinutes: booking.durationMinutes,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "durationMinutes" ? Number(value) : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/study-room/bookings/${editingBooking.id}`, editForm, authHeaders);
      setMessage("✅ Booking updated");
      setEditingBooking(null);
      fetchMyBookings();
      fetchAvailability();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data || "❌ Update failed");
    }
  };

  const canCancel = (booking) => {
    if (booking.status !== "ACTIVE") return false;
    const bookingStart = new Date(`${booking.date}T${booking.startTime}`);
    const now = new Date();
    return bookingStart - now > 2 * 60 * 60 * 1000;
  };

  // Determine if a time slot is free for a given room
  const isSlotFree = (room, slotStart, slotEnd) => {
    if (!availability) return false;
    const roomBookings = availability.bookedDetails?.filter(
      (b) => b.room === room && b.status === "ACTIVE"
    ) || [];
    if (roomBookings.length === 0) return true;
    const overlapping = roomBookings.some((b) => {
      const bStart = b.startTime;
      const bEnd = b.endTime;
      const toMins = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };
      const slotStartMins = toMins(slotStart);
      const slotEndMins = toMins(slotEnd);
      const bStartMins = toMins(bStart);
      const bEndMins = toMins(bEnd);
      return slotStartMins < bEndMins && slotEndMins > bStartMins;
    });
    return !overlapping;
  };

  const handleSlotClick = (room, slotStart) => {
    setFormData((prev) => ({
      ...prev,
      room,
      time: slotStart,
    }));
    document.querySelector(".booking-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const statusClass = (status) => {
    switch (status) {
      case "ACTIVE": return "active";
      case "CANCELLED": return "cancelled";
      default: return "expired";
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo"><h2>NEXTSTEP</h2></div>
        <button className="menu-item back-btn" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
      </aside>

      <main className="main-content">
        <header className="top-nav">
          <h1>📚 Study Room Booking</h1>
        </header>

        {/* Two‑column layout */}
        <div className="two-column">
          {/* LEFT COLUMN: Form + My Bookings */}
          <div className="left-col">
            {/* Booking Form */}
            <div className="info-card booking-form-section">
              <h3>Book a Room</h3>
              <form onSubmit={handleSubmit} className="auth-form">
                <select name="room" value={formData.room} onChange={handleChange} className="form-input" required>
                  <option value="">-- Select Room --</option>
                  {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
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
                <select name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} className="form-input">
                  <option value={30}>30 min</option>
                  <option value={60}>60 min</option>
                  <option value={90}>90 min</option>
                  <option value={120}>120 min</option>
                  <option value={180}>180 min</option>
                  <option value={240}>240 min</option>
                </select>
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? "Booking..." : "Book Now"}
                </button>
              </form>
              {message && <p style={{ marginTop: 12 }}>{message}</p>}
            </div>

            {/* My Bookings */}
            <div style={{ marginTop: 30 }}>
              <h2>My Bookings</h2>
              <div className="dashboard-cards">
                {bookings.length === 0 && <p>No bookings yet.</p>}
                {bookings.map((b) => (
                  <div key={b.id} className="info-card">
                    <h3>{b.room}</h3>
                    <p>📅 {b.date}</p>
                    <p>⏰ {b.startTime} – {b.endTime} ({b.durationMinutes} min)</p>
                    <p>
                      Status: <span className={`sr-status ${statusClass(b.status)}`}>{b.status}</span>
                    </p>
                    {b.status === "ACTIVE" && (
                      <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
                        {canCancel(b) && (
                          <button
                            className="btn-primary"
                            style={{ background: "var(--danger)" }}
                            onClick={() => handleCancel(b.id)}
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          className="btn-primary"
                          style={{ background: "var(--secondary)" }}
                          onClick={() => handleEditClick(b)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Availability Chart (Dark) */}
          <div className="right-col">
            <div className="chart-card">
              <h2>Availability Table</h2>
              {fetchingAvailability && <p>Loading chart...</p>}
              {availability && !fetchingAvailability && (
                <>
                  <div className="chart-legend">
                    <span className="legend-free">Free</span>
                    <span className="legend-booked">Booked</span>
                  </div>
                  <div className="chart-table-wrapper">
                    <table className="availability-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          {ROOMS.map(room => <th key={room}>{room}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((slot, idx) => (
                          <tr key={idx}>
                            <td className="time-label">{slot.label}</td>
                            {ROOMS.map(room => {
                              const free = isSlotFree(room, slot.start, slot.end);
                              return (
                                <td
                                  key={room}
                                  className={`chart-cell ${free ? "free" : "booked"}`}
                                  onClick={() => free && handleSlotClick(room, slot.start)}
                                  title={free ? `Click to book ${room} at ${slot.start}` : "Booked"}
                                />
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="chart-hint">Click a green cell to auto‑fill the form</p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingBooking && (
        <div className="sr-modal-overlay" onClick={() => setEditingBooking(null)}>
          <div className="sr-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Booking</h2>
            <form onSubmit={handleEditSubmit}>
              <select name="room" value={editForm.room} onChange={handleEditChange} required>
                {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <input type="date" name="date" value={editForm.date} onChange={handleEditChange} required />
              <input type="time" name="time" value={editForm.time} onChange={handleEditChange} required />
              <select name="durationMinutes" value={editForm.durationMinutes} onChange={handleEditChange}>
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
                <option value={180}>180 min</option>
                <option value={240}>240 min</option>
              </select>
              <div className="sr-modal-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditingBooking(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyRoomBooking;