// src/components/ClubEvents/AdminClubRequests.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "../../styles/AdminClubRequests.css";

const AdminClubRequests = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) navigate("/");
    else if (role !== "ADMIN") navigate("/dashboard");
  }, [token, role, navigate]);

  const load = async () => {
    try {
      setLoading(true);
      setMsg("");
      const res = await API.get("/clubs/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setRows([]);
      setMsg("❌ Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && role === "ADMIN") load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, role]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        (r.studentEmail || "").toLowerCase().includes(s) ||
        (r.clubName || "").toLowerCase().includes(s) ||
        (r.status || "").toLowerCase().includes(s)
    );
  }, [rows, q]);

  const approve = async (id) => {
    try {
      await API.post(
        `/clubs/requests/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("✅ Approved");
      load();
    } catch (e) {
      setMsg("❌ Approve failed");
    }
  };

  const decline = async (id) => {
    try {
      await API.post(
        `/clubs/requests/decline/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("✅ Declined");
      load();
    } catch (e) {
      setMsg("❌ Decline failed");
    }
  };

  return (
    <div className="acr-wrap">
      <header className="acr-top">
        <div>
          <h1>Club Join Requests</h1>
          <p>Approve or decline pending join requests.</p>
        </div>
        <div className="acr-actions">
          <button className="acr-btn acr-btn-ghost" onClick={() => navigate("/club-events")}>
            ← Clubs & Events
          </button>
          <button className="acr-btn acr-btn-ghost" onClick={() => navigate("/admin-dashboard")}>
            ← Admin Home
          </button>
        </div>
      </header>

      <div className="acr-bar">
        <input
          className="acr-input"
          placeholder="Search by email / club / status..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="acr-btn acr-btn-primary" onClick={load}>
          Refresh
        </button>
      </div>

      {msg && <div className="acr-msg">{msg}</div>}

      <div className="acr-card">
        {loading ? (
          <div className="acr-empty">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="acr-empty">No requests found.</div>
        ) : (
          <table className="acr-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Email</th>
                <th>Club</th>
                <th>Status</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.studentEmail}</td>
                  <td>{r.clubName}</td>
                  <td>
                    <span className={`acr-pill acr-${String(r.status || "").toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button className="acr-btn acr-btn-good" onClick={() => approve(r.id)}>
                      Approve
                    </button>
                    <button className="acr-btn acr-btn-bad" onClick={() => decline(r.id)}>
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminClubRequests;
