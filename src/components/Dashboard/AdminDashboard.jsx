import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Dashboard.css'; 
import '../../styles/App.css'; 

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Retrieve data from localStorage
    const userName = localStorage.getItem('userName') || 'Admin';
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Strict Protection: Redirect if no token OR if the user is not an ADMIN
        if (!token || userRole !== 'ADMIN') {
            localStorage.clear(); // Clear potentially mismatched data
            navigate('/login');
        }
    }, [token, userRole, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const allServices = [
        { name: "Club Events", path: "/club-events", desc: "Approve or create club events.", icon: "📅" },
        { name: "Stalls", path: "/stalls", desc: "Manage campus market stalls.", icon: "🏪" },
        { name: "Lost & Found", path: "/lost-found", desc: "Review reported items.", icon: "🔍" },
        { name: "Model Papers", path: "/admin-model-papers", desc: "Update academic model papers.", icon: "📝" },
        { name: "Study Room Booking", path: "/study-rooms", desc: "Control room availability.", icon: "📚" },
        { name: "Shuttle Service", path: "/add-shuttle", desc: "Update bus schedules and manage shuttles.", icon: "🚌" }
    ];

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo">
                    <h2>NEXTSTEP ADMIN</h2>
                </div>
                
                <ul className="menu-list">
                    <li 
                        className={`menu-item ${location.pathname === '/admin-dashboard' ? 'active' : ''}`} 
                        onClick={() => navigate('/admin-dashboard')}
                    >
                        <span className="menu-icon">🏠</span> Admin Home
                    </li>
                    <li 
                        className={`menu-item ${location.pathname === '/admin-model-papers' ? 'active' : ''}`} 
                        onClick={() => navigate('/admin-model-papers')}
                    >
                        <span className="menu-icon">📄</span> Manage Papers
                    </li>
                    <li 
                        className={`menu-item ${location.pathname === '/add-shuttle' ? 'active' : ''}`} 
                        onClick={() => navigate('/add-shuttle')}
                    >
                        <span className="menu-icon">🚌</span> Shuttles
                    </li>
                </ul>

                <div className="sidebar-footer">
                    <div className="user-info-brief">
                        <p>Signed in as <strong>{userName}</strong></p>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-nav">
                    <div className="nav-text">
                        <h1>Administrator Control Panel</h1>
                        <p className="welcome-subtext">Manage university resources and student services</p>
                    </div>
                    <div className="role-badge admin-bg">
                        {userRole} MODE
                    </div>
                </header>

                <div className="dashboard-cards">
                    {allServices.map((service, index) => (
                        <div key={index} className="info-card">
                            <div className="card-icon">{service.icon || '⚙️'}</div>
                            <h3>{service.name}</h3>
                            <p>{service.desc}</p>
                            <button 
                                className="view-btn" 
                                onClick={() => navigate(service.path)}
                            >
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