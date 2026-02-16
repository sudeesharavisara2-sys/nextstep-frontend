// src/components/ClubEvents/ClubEvents.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "../../styles/ClubEvents.css";

const ClubEvents = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole") || "USER";
  const userName = localStorage.getItem("userName") || "User";

  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [clubSearch, setClubSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [selectedClubId, setSelectedClubId] = useState("ALL");

  // Join modal
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinClub, setJoinClub] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [joinMsg, setJoinMsg] = useState("");

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    const loadClubs = async () => {
      try {
        setLoadingClubs(true);
        const res = await API.get("/clubs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClubs(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setClubs([]);
      } finally {
        setLoadingClubs(false);
      }
    };

    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        const res = await API.get("/clubs/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadClubs();
    loadEvents();
  }, [token]);

  const clubMap = useMemo(() => {
    const m = new Map();
    clubs.forEach((c) => m.set(c.id, c));
    return m;
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    const q = clubSearch.trim().toLowerCase();
    if (!q) return clubs;
    return clubs.filter(
      (c) =>
        (c.clubName || "").toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q)
    );
  }, [clubs, clubSearch]);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    let list = events;

    if (selectedClubId !== "ALL") {
      const cid = Number(selectedClubId);
      // If your backend EventResponse doesn't include clubId, filter fallback by title/desc only
      list = list.filter((e) => e.clubId === cid);
    }

    if (!q) return list;

    return list.filter(
      (e) =>
        (e.title || "").toLowerCase().includes(q) ||
        (e.description || "").toLowerCase().includes(q)
    );
  }, [events, eventSearch, selectedClubId]);

  const openJoin = (club) => {
    setJoinMsg("");
    setJoinClub(club);
    setStudentEmail("");
    setJoinOpen(true);
  };

  const closeJoin = () => {
    setJoinOpen(false);
    setJoinClub(null);
    setStudentEmail("");
    setJoinMsg("");
  };

  const submitJoin = async (e) => {
    e.preventDefault();
    setJoinMsg("");

    if (!joinClub?.id) return;

    try {
      const res = await API.post(
        "/clubs/join",
        { clubId: joinClub.id, studentEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoinMsg(res.data?.message ? `✅ ${res.data.message}` : "✅ Request submitted");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        "❌ Request failed";
      setJoinMsg(`❌ ${msg}`);
    }
  };

  const goBack = () => {
    if (userRole === "ADMIN") navigate("/admin-dashboard");
    else navigate("/dashboard");
  };

  return (
    <div className="ce-layout">
      <aside className="ce-sidebar">
        <div className="ce-brand">
          <div className="ce-logo">N</div>
          <div>
            <div className="ce-title">NEXTSTEP</div>
            <div className="ce-sub">Clubs & Events</div>
          </div>
        </div>

        <div className="ce-user">
          <div className="ce-user-name">{userName}</div>
          <div className="ce-user-role">{userRole}</div>
        </div>

        <button className="ce-btn ce-btn-ghost" onClick={goBack}>
          ← Back
        </button>

        {userRole === "ADMIN" && (
          <button className="ce-btn ce-btn-primary" onClick={() => navigate("/admin/club-requests")}>
            Admin: Join Requests
          </button>
        )}

        <button
          className="ce-btn ce-btn-danger"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </aside>

      <main className="ce-main">
        <header className="ce-header">
          <div>
            <h1>Club Events</h1>
            <p>Browse clubs, see events, and request to join.</p>
          </div>
        </header>

        <section className="ce-grid">
          {/* Clubs */}
          <div className="ce-panel">
            <div className="ce-panel-head">
              <h2>Clubs</h2>
              <input
                className="ce-input"
                placeholder="Search clubs..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
              />
            </div>

            {loadingClubs ? (
              <div className="ce-empty">Loading clubs...</div>
            ) : filteredClubs.length === 0 ? (
              <div className="ce-empty">No clubs found.</div>
            ) : (
              <div className="ce-cards">
                {filteredClubs.map((c) => (
                  <div key={c.id} className="ce-card">
                    <div className="ce-card-top">
                      <div className="ce-card-title">{c.clubName}</div>
                      <div className="ce-badge">Club</div>
                    </div>
                    <div className="ce-card-desc">{c.description}</div>
                    <div className="ce-card-actions">
                      <button className="ce-btn ce-btn-primary" onClick={() => openJoin(c)}>
                        Request to Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Events */}
          <div className="ce-panel">
            <div className="ce-panel-head">
              <h2>Events</h2>
              <div className="ce-row">
                <select
                  className="ce-select"
                  value={selectedClubId}
                  onChange={(e) => setSelectedClubId(e.target.value)}
                >
                  <option value="ALL">All clubs</option>
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.clubName}
                    </option>
                  ))}
                </select>
                <input
                  className="ce-input"
                  placeholder="Search events..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                />
              </div>
            </div>

            {loadingEvents ? (
              <div className="ce-empty">Loading events...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="ce-empty">No events found.</div>
            ) : (
              <div className="ce-events">
                {filteredEvents.map((ev) => (
                  <div key={ev.id} className="ce-event">
                    <div className="ce-event-title">{ev.title}</div>
                    <div className="ce-event-meta">
                      <span className="ce-badge ce-badge-soft">
                        {ev.eventDate ? new Date(ev.eventDate).toLocaleString() : "No date"}
                      </span>
                    </div>
                    <div className="ce-event-desc">{ev.description}</div>
                    {/* If your backend later sends clubName/clubId you can show it here */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {joinOpen && (
        <div className="ce-modal-overlay" onClick={closeJoin}>
          <div className="ce-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ce-modal-head">
              <h3>Join Request</h3>
              <button className="ce-x" onClick={closeJoin}>
                ×
              </button>
            </div>

            <div className="ce-modal-body">
              <div className="ce-modal-club">
                Club: <strong>{joinClub?.clubName}</strong>
              </div>

              <form onSubmit={submitJoin} className="ce-form">
                <label className="ce-label">Student Email</label>
                <input
                  type="email"
                  className="ce-input"
                  placeholder="example@student.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />

                <button className="ce-btn ce-btn-primary" type="submit">
                  Submit Request
                </button>
              </form>

              {joinMsg && <div className="ce-msg">{joinMsg}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubEvents;
