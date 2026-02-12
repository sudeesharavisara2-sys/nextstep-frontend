import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NextStepSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/dashboard" },
    { name: "Shuttle Service", path: "/shuttle-service" },
    { name: "Stall Booking", path: "/stalls" },
    { name: "Club Events", path: "#" },
    { name: "Lost & Found", path: "#" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>NEXTSTEP</h2>
      </div>
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li 
            key={item.name}
            className={`menu-item ${location.pathname === item.path ? "active-menu" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </li>
        ))}
      </ul>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}