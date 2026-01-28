// src/components/Dashboard/AdminDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import "../../styles/App.css";
import logo from "../../assets/logo1.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Admin";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const allServices = [
    { name: "Core System", path: "/core-system", desc: "Manage system architecture." },
    { name: "Club Events", path: "/club-events", desc: "Approve or create club events." },
    { name: "Stalls", path: "/stalls", desc: "Manage campus market stalls." },
    { name: "Lost & Found", path: "/lost-found-list", desc: "Review reported items." }, // Admin sees list
    { name: "Model Papers", path: "/model-papers", desc: "Update academic model papers." },
    { name: "Study Room Booking", path: "/study-rooms", desc: "Control room availability." },
    { name: "Shuttle Service", path: "/add-shuttle", desc: "Update bus schedules and manage shuttles." },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">
                   <img src={logo} alt="NextStep Logo" className="logo-img" />
                </div>
        <ul className="menu-list">
          <li className="menu-item active" onClick={() => navigate("/admin-dashboard")}>Admin Home</li>
          {allServices.map((service, index) => (
            <li key={index} className="menu-item" onClick={() => navigate(service.path)}>
              {service.name}
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-nav">
          <div className="nav-text">
            <h1>Administrator Control Panel</h1>
            <p>Logged in as: <strong>{userName}</strong></p>
          </div>
        </header>

        <div className="dashboard-cards">
          {allServices.map((service, index) => (
            <div key={index} className="info-card">
              <div className="card-icon">⚙️</div>
              <h3>{service.name}</h3>
              <p>{service.desc}</p>
              <button className="view-btn" onClick={() => navigate(service.path)}>
                Manage Service
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
