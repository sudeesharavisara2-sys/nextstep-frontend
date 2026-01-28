// src/components/Dashboard/Dashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import "../../styles/App.css";
import logo from "../../assets/logo1.png";

const Dashboard = () => {
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole") || "USER";
  const userName = localStorage.getItem("userName") || "User";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // All available services
  const allServices = [
    { name: "Core System", path: "/core-system", desc: "Manage central administration.", roles: ["ADMIN"] },
    { name: "Club Events", path: "/club-events", desc: "Explore university activities.", roles: ["USER", "ADMIN"] },
    { name: "Stalls", path: "/stalls", desc: "Reserve and track stall spots.", roles: ["USER", "ADMIN"] },
    { name: "Lost & Found", path: "/lost-found", desc: "Report or view lost/found items.", roles: ["USER", "ADMIN"] },
    { name: "Model Papers", path: "/model-papers", desc: "Download study materials.", roles: ["USER", "ADMIN"] },
    { name: "Study Room Booking", path: "/study-rooms", desc: "Book your library space.", roles: ["USER", "ADMIN"] },
    { name: "Shuttle Service", path: "/shuttle-service", desc: "Transport schedule.", roles: ["USER", "ADMIN"] },
  ];

  const filteredServices = allServices.filter(service => service.roles.includes(userRole));

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">
                   <img src={logo} alt="NextStep Logo" className="logo-img" />
                </div>
        <ul className="menu-list">
          <li className="menu-item" onClick={() => navigate("/dashboard")}>Home</li>
          {filteredServices.map((service, index) => (
            <li key={index} className="menu-item" onClick={() => navigate(service.path)}>
              {service.name}
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </aside>

      <main className="main-content">
        <header className="top-nav">
          <div>
            <h1>User Dashboard</h1>
            <p style={{ opacity: 0.8 }}>Welcome back, {userName}!</p>
          </div>
          <div className="role-badge user-bg">Logged in as {userRole}</div>
        </header>

        <div className="dashboard-cards">
          {filteredServices.map((service, index) => (
            <div key={index} className="info-card">
              <h3>{service.name}</h3>
              <p>{service.desc}</p>
              <button className="view-btn" onClick={() => navigate(service.path)}>
                Open Service
              </button>
            </div>
          ))}
        </div>
      </main>
      {/* Floating Footer Text */}
            <div className="powered-by">
                Powered by NSBM
            </div>
    </div>
    
  );
};

export default Dashboard;
