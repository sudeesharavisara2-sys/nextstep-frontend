import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './App.css'; 

const AdminDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Admin';
    const token = localStorage.getItem('accessToken'); 

    useEffect(() => {
        if (!token) navigate('/login');
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const allServices = [
        { name: "Core System", path: "/core-system", desc: "Manage system architecture." },
        { name: "Club Events", path: "/club-events", desc: "Approve or create club events." },
        { name: "Stalls", path: "/stalls", desc: "Manage campus market stalls." },
        { name: "Lost & Found", path: "/lost-found", desc: "Review reported items." },
        { name: "Model Papers", path: "/model-papers", desc: "Update academic model papers." },
        { name: "Study Room Booking", path: "/study-rooms", desc: "Control room availability." },
        { name: "Shuttle Service", path: "/add-shuttle", desc: "Update bus schedules and manage shuttles." } // path එක වෙනස් කළා
    ];

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo"><h2>NEXTSTEP ADMIN</h2></div>
                <ul className="menu-list">
                    <li className="menu-item active" onClick={() => navigate('/admin-dashboard')}>Admin Home</li>
                </ul>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </aside>

            <main className="main-content">
                <header className="top-nav">
                    <h1>Administrator Control Panel</h1>
                    <p>Logged in as: {userName}</p>
                </header>

                <div className="dashboard-cards">
                    {allServices.map((service, index) => (
                        <div key={index} className="info-card">
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