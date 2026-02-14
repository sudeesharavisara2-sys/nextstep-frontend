import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/Dashboard.css";
// ✅ Import the logo asset
import logo from "../../assets/logo1.png";

export default function NextStepSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Updated menu items to include Study Rooms and Model Papers
  const menuItems = [
    { name: "Home", path: "/dashboard" },
    { name: "Stall Booking", path: "/stalls" },
    
  ];

  const handleLogout = () => {
    localStorage.clear(); // Clears all session data
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* ✅ Logo updated to image */}
      <div className="logo">
        <img src={logo} alt="NextStep Logo" className="logo-img" />
      </div>

      <ul className="menu-list">
        {menuItems.map((item) => (
          <li 
            key={item.name}
            className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => item.path !== "#" && navigate(item.path)}
          >
            {item.name}
          </li>
        ))}
      </ul>

      
    </aside>
  );
}