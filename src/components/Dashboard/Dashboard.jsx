import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css'; // Correct path to your dashboard styles
import '../../styles/App.css';       // Global styles (if any)

const Dashboard = () => {
    const navigate = useNavigate();

    // Get user info from localStorage
    const userRole = localStorage.getItem('userRole') || 'USER';
    const userName = localStorage.getItem('userName') || 'User';
    const token = localStorage.getItem('token');

    // Redirect to login if no token
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/'); // Back to login
    };

    // Services available to users (all except admin-only ones)
    const allServices = [
        { name: "Core System", path: "/core-system", desc: "Manage central administration.", roles: ["ADMIN"] },
        { name: "Club Events", path: "/club-events", desc: "Explore university activities.", roles: ["USER", "ADMIN"] },
        { name: "Stalls", path: "/stalls", desc: "Reserve and track stall spots.", roles: ["USER", "ADMIN"] },
        { name: "Lost & Found", path: "/lost-found", desc: "Report missing belongings.", roles: ["USER", "ADMIN"] },
        { name: "Model Papers", path: "/model-papers", desc: "Download study materials.", roles: ["USER", "ADMIN"] },
        { name: "Study Room Booking", path: "/study-rooms", desc: "Book your library space.", roles: ["USER", "ADMIN"] },
        { name: "Shuttle Service", path: "/shuttle-service", desc: "Transport schedule.", roles: ["USER", "ADMIN"] }
    ];

    // Filter services based on user role (shows all for admin, but this is the user dashboard)
    const filteredServices = allServices.filter(service =>
        service.roles.includes(userRole)
    );

    return (
        <div className="dashboard-layout">
            {/* Sidebar - glass effect */}
            <aside className="sidebar">
                <div className="logo"><h2>NEXTSTEP</h2></div>
                <ul className="menu-list">
                    <li className="menu-item" onClick={() => navigate('/dashboard')}>
                        Home
                    </li>
                    {filteredServices.map((service, index) => (
                        <li key={index} className="menu-item" onClick={() => navigate(service.path)}>
                            {service.name}
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
                    <div>
                        <h1>User Dashboard</h1>
                        <p style={{ opacity: 0.8 }}>Welcome back, {userName}!</p>
                    </div>
                    <div className="role-badge user-bg">
                        Logged in as {userRole}
                    </div>
                </header>

                {/* Service Cards */}
                <div className="dashboard-cards">
                    {filteredServices.map((service, index) => (
                        <div key={index} className="info-card">
                            <h3>{service.name}</h3>
                            <p>{service.desc}</p>
                            <button
                                className="view-btn"
                                onClick={() => navigate(service.path)}
                            >
                                Open Service
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;