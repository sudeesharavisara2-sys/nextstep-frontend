// src/components/StudyRoom/StudyRoomAdmin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "../../styles/StudyRoom.css";

const StudyRoomAdmin = () => {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");

  const [raw, setRaw] = useState([]);
  const [totalRooms, setTotalRooms] = useState(null);

  const [mode, setMode] = useState("ALL"); // ALL | STATUS | DATE
  const [status, setStatus] = useState("ACTIVE");
  const [date, setDate] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("NEWEST"); // NEWEST | OLDEST | ROOM_AZ

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Guard
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }
  }, [token, role, navigate]);

  const authConfig = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const load = async () => {
    setLoading(true);
    setMessage("");

    try {
      let res;

      if (mode === "ALL") {
        res = await API.get("/study-room/admin/bookings/all", authConfig);
        setTotalRooms(res.data?.totalRooms ?? null);
        setRaw(res.data?.bookings ?? []);
      } else if (mode === "STATUS") {
        res = await API.get(
          "/study-room/admin/bookings/by-status",
          {
            ...authConfig,
            params: { status },
          }
        );
        setTotalRooms(null);
        setRaw(res.data ?? []);
      } else {
        // DATE
        if (!date) {
          setMessage("❗ Select a date first");
          setRaw([]);
          return;
        }

        res = await API.get(
          "/study-room/admin/bookings/by-date",
          {
            ...authConfig,
            params: { date },
          }
        );
        setTotalRooms(null);
        setRaw(res.data ?? []);
      }
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.Error ||
        err?.response?.data?.error ||
        "Load failed";

      setMessage(msg);
      setRaw([]);

      if (err?.response?.status === 401) navigate("/login");
      if (err?.response?.status === 403) navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || role !== "ADMIN") return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, status, date, token, role]);

  const list = useMemo(() => {
    let items = [...raw];
    const q = search.trim().toLowerCase();

    if (q) {
      items = items.filter((b) =>
        [b.room, b.status, b.date, b.startTime, b.endTime, b.userId]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (sort === "ROOM_AZ") {
      items.sort((a, b) => (a.room || "").localeCompare(b.room || ""));
    } else if (sort === "OLDEST") {
      items.sort((a, b) =>
        `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
      );
    } else {
      items.sort((a, b) =>
        `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`)
      );
    }

    return items;
  }, [raw, search, sort]);

  const bookedRoomsCount = useMemo(() => {
    if (typeof totalRooms !== "number") return null;
    return raw.filter((b) => b.status === "ACTIVE").length;
  }, [raw, totalRooms]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;

    setDeletingId(id);
    setMessage("");

    try {
      await API.delete(`/study-room/admin/bookings/${id}`, authConfig);
      setMessage("✅ Booking deleted");
      load();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.Error ||
        err?.response?.data?.error ||
        "Delete failed";
      setMessage(msg);

      if (err?.response?.status === 401) navigate("/login");
      if (err?.response?.status === 403) navigate("/dashboard");
    } finally {
      setDeletingId(null);
    }
  };

  const clear = () => {
    setMode("ALL");
    setStatus("ACTIVE");
    setDate("");
    setSearch("");
    setSort("NEWEST");
    setMessage("");
  };

  return (
    <div className="sr-page">
      <div className="sr-shell">
        <aside className="sr-sidebar">
          <div className="sr-brand">
            <div className="sr-badge">A</div>
            <div>
              <div className="sr-title">NEXTSTEP</div>
              <div className="sr-subtitle">Admin • Study Rooms</div>
            </div>
          </div>

          <button className="sr-btn" onClick={() => navigate("/admin-dashboard")}>
            ⬅ Back
          </button>
          <button className="sr-btn" onClick={load} disabled={loading}>
            🔄 Refresh
          </button>
          <button className="sr-btn" onClick={clear}>
            🧹 Clear
          </button>

          {typeof totalRooms === "number" && (
            <div className="sr-msg">
              Total Rooms: <b>{totalRooms}</b>
              <br />
              Active bookings: <b>{bookedRoomsCount}</b>
            </div>
          )}
        </aside>

        <main className="sr-main">
          <h1>Study Room Admin</h1>

          <div className="sr-card">
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="ALL">All</option>
              <option value="STATUS">By Status</option>
              <option value="DATE">By Date</option>
            </select>

            {mode === "STATUS" && (
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
            )}

            {mode === "DATE" && (
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            )}

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="NEWEST">Newest</option>
              <option value="OLDEST">Oldest</option>
              <option value="ROOM_AZ">Room A-Z</option>
            </select>

            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={load} disabled={loading}>
              {loading ? "Loading..." : "Load"}
            </button>

            {message && <div className="sr-msg">{message}</div>}
          </div>

          <div className="sr-cards">
            {list.map((b) => (
              <div key={b.id} className="sr-booking">
                <h3>{b.room}</h3>
                <p>Date: {b.date}</p>
                <p>
                  Time: {b.startTime} - {b.endTime}{" "}
                  {b.durationMinutes ? `(${b.durationMinutes} min)` : ""}
                </p>
                {b.userId && <p>User ID: {b.userId}</p>}
                <span className="sr-status">{b.status}</span>

                <button
                  className="sr-danger"
                  disabled={deletingId === b.id}
                  onClick={() => handleDelete(b.id)}
                >
                  {deletingId === b.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudyRoomAdmin;