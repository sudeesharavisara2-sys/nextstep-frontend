import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Admin';
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const allServices = [
        { name: "Core System", path: "/core-system", desc: "Manage system architecture and main controls." },
        { name: "Club Events", path: "/club-events", desc: "Approve or create new university club events." },
        { name: "Stalls", path: "/stalls", desc: "Assign and manage campus market stall locations." },
        { name: "Lost & Found", path: "/lost-found", desc: "Review reported items and manage claims." },
        { name: "Model Papers", path: "/model-papers", desc: "Upload and update academic model papers." },
        { name: "Study Room Booking", path: "/study-rooms", desc: "Control library room availability and bookings." },
        { name: "Shuttle Service", path: "/shuttle-service", desc: "Update bus schedules and track shuttle status." }
    ];

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo"><h2>NEXTSTEP ADMIN</h2></div>
                <ul className="menu-list">
                    <li className="menu-item" style={{backgroundColor: 'rgba(255,255,255,0.2)'}} onClick={() => navigate('/admin-dashboard')}>
                        Admin Home
                    </li>
                    {allServices.map((service, index) => (
                        <li key={index} className="menu-item" onClick={() => navigate(service.path)}>
                            {service.name}
                        </li>
                    ))}
                    <li className="menu-item" style={{color: '#fffa'}}>User Analytics</li>
                </ul>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </aside>

            <main className="main-content">
                <header className="top-nav">
                    <div>
                        <h1>Administrator Control Panel</h1>
                        <p style={{opacity: 0.8}}>Full system access granted.</p>
                    </div>
                    <div className="role-badge admin-bg">
                        Logged in as ADMIN ({userName})
                    </div>
                </header>

                <div className="dashboard-cards">
                    {allServices.map((service, index) => (
                        <div key={index} className="info-card">
                            <h3>{service.name}</h3>
                            <p>{service.desc}</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button 
                                    className="view-btn" 
                                    style={{ background: 'linear-gradient(to right, #f64f59, #c471ed)', color: 'white' }}
                                    onClick={() => navigate(service.path)}
                                >
                                    Manage Service
                                </button>

                                {service.name === "Shuttle Service" && (
                                    <button 
                                        className="view-btn" 
                                        style={{ background: '#006837', color: 'white', border: 'none' }}
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            navigate('/add-shuttle');
                                        }}
                                    >
                                        + Add New Shuttle
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;