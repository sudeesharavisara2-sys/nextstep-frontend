import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "../../styles/StudyRoom.css";

const StudyRoomAdmin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");

  const ROOMS = useMemo(() => ["A1", "A2", "A3", "B1", "B2", "C1", "C2", "C3"], []);

  const [chartDate, setChartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState(null);
  const [fetchingAvailability, setFetchingAvailability] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 8; h <= 21; h++) {
      slots.push({
        start: `${h.toString().padStart(2, "0")}:00`,
        end: `${(h + 1).toString().padStart(2, "0")}:00`,
        label: `${h.toString().padStart(2, "0")}:00`
      });
    }
    return slots;
  }, []);

  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("flat");
  const [search, setSearch] = useState("");

  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [bookingForUser, setBookingForUser] = useState(null);
  const [bookForm, setBookForm] = useState({ room: "", date: "", time: "", durationMinutes: 60 });
  const [deletingId, setDeletingId] = useState(null);

  const authConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  // Auth guard
  useEffect(() => {
    if (!token) navigate("/login");
    else if (role !== "ADMIN") navigate("/dashboard");
  }, [token, role, navigate]);

  // Fetch all bookings
  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/study-room/admin/bookings/all", authConfig);
      const data = res.data;
      setRawData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to load bookings");
      setRawData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // Fetch availability
  const fetchAvailability = async () => {
    if (!chartDate) return;
    setFetchingAvailability(true);
    try {
      const res = await API.get("/study-room/availability", {
        ...authConfig,
        params: { date: chartDate },
      });
      setAvailability(res.data || { bookedDetails: [] });
    } catch (err) {
      console.error(err);
      setAvailability({ bookedDetails: [] });
    } finally {
      setFetchingAvailability(false);
    }
  };

  useEffect(() => {
    if (showChart && chartDate) fetchAvailability();
  }, [chartDate, showChart]);

  // Flatten bookings safely
  const flattenedBookings = useMemo(() => {
    if (!Array.isArray(rawData)) return [];
    return rawData.flatMap(user => {
      if (!user || !Array.isArray(user.bookings)) return [];
      return user.bookings.map(b => ({
        ...b,
        userId: user.userId,
        userName: user.userName,
        userEmail: user.userEmail,
      }));
    });
  }, [rawData]);

  // Filtered bookings/search
  const filteredData = useMemo(() => {
    if (!search.trim()) return viewMode === "flat" ? flattenedBookings : rawData;
    const q = search.toLowerCase();
    if (viewMode === "flat") {
      return flattenedBookings.filter(b =>
        [b.room, b.status, b.date, b.userName, b.userEmail].join(" ").toLowerCase().includes(q)
      );
    } else {
      return rawData.filter(user =>
        [user.userName, user.userEmail].join(" ").toLowerCase().includes(q)
      );
    }
  }, [viewMode, flattenedBookings, rawData, search]);

  // Delete booking
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    setDeletingId(id);
    try {
      await API.delete(`/study-room/admin/bookings/${id}`, authConfig);
      setMessage("✅ Booking deleted");
      fetchAllBookings();
    } catch (err) {
      setMessage("❌ Delete failed");
    } finally {
      setDeletingId(null);
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
    setEditForm(prev => ({ ...prev, [name]: name === "durationMinutes" ? Number(value) : value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/study-room/admin/bookings/${editingBooking.id}`, editForm, authConfig);
      setMessage("✅ Booking updated");
      setEditingBooking(null);
      fetchAllBookings();
    } catch (err) {
      setMessage("❌ Update failed");
    }
  };

  const handleBookForUser = (userId) => {
    setBookingForUser({ show: true, userId });
    setBookForm({ room: "", date: "", time: "", durationMinutes: 60 });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/study-room/admin/book-for-user/${bookingForUser.userId}`, bookForm, authConfig);
      setMessage("✅ Booking created");
      setBookingForUser(null);
      fetchAllBookings();
    } catch (err) {
      setMessage("❌ Booking failed");
    }
  };

  const isSlotFree = (room, slotStart, slotEnd) => {
    if (!availability || !Array.isArray(availability.bookedDetails)) return true;
    const roomBookings = availability.bookedDetails.filter(b => b.room === room && b.status === "ACTIVE");
    if (!roomBookings.length) return true;
    const toMins = t => t.split(":").map(Number).reduce((h, m, i) => i === 0 ? h*60 + m : h, 0);
    return !roomBookings.some(b => toMins(slotStart) < toMins(b.endTime) && toMins(slotEnd) > toMins(b.startTime));
  };

  const statusClass = (status) => {
    switch (status) {
      case "ACTIVE": return "active";
      case "CANCELLED": return "cancelled";
      default: return "expired";
    }
  };

  return (
    <div className="sr-page" style={{ background: "linear-gradient(135deg, #01185e 35%, #42cc1b 100%)" }}>
      <div className="sr-shell">
        <aside className="sr-sidebar">
          <div className="sr-brand">
            <div className="sr-badge">A</div>
            <div>
              <div className="sr-title">NEXTSTEP</div>
              <div className="sr-subtitle">Admin • All Users</div>
            </div>
          </div>
          <button className="sr-btn" onClick={() => navigate("/admin-dashboard")}>⬅ Back</button>
          <button className="sr-btn" onClick={fetchAllBookings}>🔄 Refresh</button>
          <button className="sr-btn" onClick={() => setShowChart(!showChart)}>
            {showChart ? "📊 Hide Chart" : "📊 Show Chart"}
          </button>
          {message && <div className="sr-msg">{message}</div>}
        </aside>

        <main className="sr-main">
          <h1>All Users & Their Bookings</h1>

          {showChart && (
            <div className="top-row">
              <div className="chart-card admin-chart">
                <h2>Availability Chart</h2>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ color: "white", marginRight: "10px" }}>Select Date:</label>
                  <input
                    type="date"
                    value={chartDate}
                    onChange={(e) => setChartDate(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", border: "none", background: "#f1f5f9", fontSize: "14px" }}
                  />
                </div>
                {fetchingAvailability && <p style={{ color: "#cbd5e1" }}>Loading chart...</p>}
                {availability && !fetchingAvailability && (
                  <>
                    <div className="chart-legend">
                      <span className="legend-free">Free</span>
                      <span className="legend-booked">Booked</span>
                    </div>
                    <div className="chart-table-wrapper">
                      <table className="availability-table">
                        <thead>
                          <tr><th>Time</th>{ROOMS.map(room => <th key={room}>{room}</th>)}</tr>
                        </thead>
                        <tbody>
                          {timeSlots.map((slot, idx) => (
                            <tr key={idx}>
                              <td className="time-label">{slot.label}</td>
                              {ROOMS.map(room => (
                                <td key={room} className={`chart-cell ${isSlotFree(room, slot.start, slot.end) ? "free" : "booked"}`} title={isSlotFree(room, slot.start, slot.end) ? "Free" : "Booked"} />
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="chart-hint">Green = Free, Red = Booked</p>
                  </>
                )}
              </div>

              <div className="sr-card filter-card">
                <input placeholder="Search by room, user, status..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                  <option value="flat">Flat View (All Bookings)</option>
                  <option value="grouped">Grouped by User</option>
                </select>
              </div>
            </div>
          )}

          {!showChart && (
            <div className="sr-card filter-card" style={{ marginBottom: "30px" }}>
              <input placeholder="Search by room, user, status..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                <option value="flat">Flat View (All Bookings)</option>
                <option value="grouped">Grouped by User</option>
              </select>
            </div>
          )}

          {loading ? <p>Loading...</p> : viewMode === "flat" ? (
            <div className="sr-cards">
              {filteredData.map(b => (
                <div key={b.id} className="sr-booking">
                  <h3>{b.room} <span className={`sr-status ${statusClass(b.status)}`}>{b.status}</span></h3>
                  <p>📅 {b.date}</p>
                  <p>⏰ {b.startTime} – {b.endTime} ({b.durationMinutes} min)</p>
                  <p>👤 {b.userName} ({b.userEmail})</p>
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <button className="sr-btn" style={{ background: "var(--secondary)" }} onClick={() => handleEditClick(b)}>Edit</button>
                    <button className="sr-danger" disabled={deletingId === b.id} onClick={() => handleDelete(b.id)}>{deletingId === b.id ? "..." : "Delete"}</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="sr-cards">
              {filteredData.map(user => (
                <div key={user.userId} className="sr-booking">
                  <h3>{user.userName}</h3>
                  <p>📧 {user.userEmail}</p>
                  <p>📚 Bookings: {user.bookings?.length || 0}</p>
                  <button className="sr-btn" style={{ background: "var(--primary)", marginTop: 8 }} onClick={() => handleBookForUser(user.userId)}>+ Book for this user</button>
                  {user.bookings?.length > 0 && (
                    <details style={{ marginTop: 16 }}>
                      <summary style={{ cursor: "pointer", color: "var(--primary)" }}>Show bookings</summary>
                      {user.bookings.map(b => (
                        <div key={b.id} style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                          <p><strong>{b.room}</strong> – {b.date} {b.startTime}-{b.endTime}</p>
                          <span className={`sr-status ${statusClass(b.status)}`}>{b.status}</span>
                          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                            <button className="sr-btn" style={{ background: "var(--secondary)", padding: "4px 8px", fontSize: "12px" }} onClick={() => handleEditClick(b)}>Edit</button>
                            <button className="sr-danger" style={{ padding: "4px 8px", fontSize: "12px" }} disabled={deletingId === b.id} onClick={() => handleDelete(b.id)}>{deletingId === b.id ? "..." : "Delete"}</button>
                          </div>
                        </div>
                      ))}
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      {editingBooking && (
        <div className="sr-modal-overlay" onClick={() => setEditingBooking(null)}>
          <div className="sr-modal" onClick={e => e.stopPropagation()}>
            <h2>Edit Booking (Admin)</h2>
            <form onSubmit={handleEditSubmit}>
              <select name="room" value={editForm.room} onChange={handleEditChange} required>
                <option value="">Select room</option>
                {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <input type="date" name="date" value={editForm.date} onChange={handleEditChange} required />
              <input type="time" name="time" value={editForm.time} onChange={handleEditChange} required />
              <select name="durationMinutes" value={editForm.durationMinutes} onChange={handleEditChange}>
                {[30,60,90,120,180,240].map(m => <option key={m} value={m}>{m} min</option>)}
              </select>
              <div className="sr-modal-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditingBooking(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book for User Modal */}
      {bookingForUser?.show && (
        <div className="sr-modal-overlay" onClick={() => setBookingForUser(null)}>
          <div className="sr-modal" onClick={e => e.stopPropagation()}>
            <h2>Book for User ID: {bookingForUser.userId}</h2>
            <form onSubmit={handleBookSubmit}>
              <select value={bookForm.room} onChange={e => setBookForm({ ...bookForm, room: e.target.value })} required>
                <option value="">Select room</option>
                {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <input type="date" value={bookForm.date} onChange={e => setBookForm({ ...bookForm, date: e.target.value })} required />
              <input type="time" value={bookForm.time} onChange={e => setBookForm({ ...bookForm, time: e.target.value })} required />
              <select value={bookForm.durationMinutes} onChange={e => setBookForm({ ...bookForm, durationMinutes: Number(e.target.value) })}>
                {[30,60,90,120,180,240].map(m => <option key={m} value={m}>{m} min</option>)}
              </select>
              <div className="sr-modal-actions">
                <button type="submit">Create Booking</button>
                <button type="button" onClick={() => setBookingForUser(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyRoomAdmin;