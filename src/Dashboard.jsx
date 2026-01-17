import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const menuItems = [
        "Core System",
        "Club Events",
        "Stalls",
        "Lost & Found",
        "Model Papers",
        "Study Room Booking",
        "Shuttle Service"
    ];

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo">
                    <h2>NEXTSTEP</h2>
                </div>
                <ul className="menu-list">
                    {menuItems.map((item, index) => (
                        <li key={index} className="menu-item">
                            {item}
                        </li>
                    ))}
                </ul>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-nav">
                    <h1>Dashboard Overview</h1>
                    <div className="user-info">Welcome, User!</div>
                </header>

                <div className="dashboard-cards">
                    {menuItems.map((item, index) => (
                        <div key={index} className="info-card">
                            <h3>{item}</h3>
                            <p>Manage and view {item} details here.</p>
                            <button className="view-btn">Open</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;