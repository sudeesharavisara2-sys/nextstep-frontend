import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import '../../styles/Dashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Admin';
    const token = localStorage.getItem('token');

    useEffect(() => {
=======
import '../../styles/Dashboard.css'; 
import '../../styles/App.css'; 

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    // Retrieve data from localStorage (must match keys used during Login)
    const userName = localStorage.getItem('userName') || 'Admin';
    const token = localStorage.getItem('token'); // Changed from 'accessToken' to 'token' for consistency

    useEffect(() => {
        // Redirect to Login if the authentication token is missing
>>>>>>> 88791749c61f2ad401908b7214a63db9fb5d6b91
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const allServices = [
<<<<<<< HEAD
        { name: "Core System", path: "/core-system", desc: "Manage system architecture and main controls." },
        { name: "Club Events", path: "/club-events", desc: "Approve or create new university club events." },
        { name: "Stalls", path: "/stalls", desc: "Assign and manage campus market stall locations." },
        { name: "Lost & Found", path: "/lost-found", desc: "Review reported items and manage claims." },
        { name: "Model Papers", path: "/model-papers", desc: "Upload and update academic model papers." },
        { name: "Study Room Booking", path: "/study-rooms", desc: "Control library room availability and bookings." },
        { name: "Shuttle Service", path: "/shuttle-service", desc: "Update bus schedules and track shuttle status." }
=======
        { name: "Core System", path: "/core-system", desc: "Manage system architecture." },
        { name: "Club Events", path: "/club-events", desc: "Approve or create club events." },
        { name: "Stalls", path: "/stalls", desc: "Manage campus market stalls." },
        { name: "Lost & Found", path: "/lost-found", desc: "Review reported items." },
        { name: "Model Papers", path: "/model-papers", desc: "Update academic model papers." },
        { name: "Study Room Booking", path: "/study-rooms", desc: "Control room availability." },
        { name: "Shuttle Service", path: "/add-shuttle", desc: "Update bus schedules and manage shuttles." }
>>>>>>> 88791749c61f2ad401908b7214a63db9fb5d6b91
    ];

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo"><h2>NEXTSTEP ADMIN</h2></div>
                <ul className="menu-list">
<<<<<<< HEAD
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
=======
                    <li className="menu-item active" onClick={() => navigate('/admin-dashboard')}>
                        Admin Home
                    </li>
                    {/* Additional Admin Menu Items can be added here as needed */}
                </ul>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
>>>>>>> 88791749c61f2ad401908b7214a63db9fb5d6b91
            </aside>

            <main className="main-content">
                <header className="top-nav">
<<<<<<< HEAD
                    <div>
                        <h1>Administrator Control Panel</h1>
                        <p style={{opacity: 0.8}}>Full system access granted.</p>
                    </div>
                    <div className="role-badge admin-bg">
                        Logged in as ADMIN ({userName})
=======
                    <div className="nav-text">
                        <h1>Administrator Control Panel</h1>
                        <p>Logged in as: <strong>{userName}</strong></p>
>>>>>>> 88791749c61f2ad401908b7214a63db9fb5d6b91
                    </div>
                </header>

                <div className="dashboard-cards">
                    {allServices.map((service, index) => (
                        <div key={index} className="info-card">
<<<<<<< HEAD
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
=======
                            <div className="card-icon">⚙️</div> {/* Adding an icon improves the UI appearance */}
                            <h3>{service.name}</h3>
                            <p>{service.desc}</p>
                            <button className="view-btn" onClick={() => navigate(service.path)}>
                                Manage Service
                            </button>
>>>>>>> 88791749c61f2ad401908b7214a63db9fb5d6b91
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;