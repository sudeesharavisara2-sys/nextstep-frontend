import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './App.css'; 

const AdminDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Admin';
    const token = localStorage.getItem('accessToken'); 

    // --- Shuttle State ---
    const [shuttles, setShuttles] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        loadShuttles();
    }, [token, navigate]);

    // --- Shuttle Logic Functions ---
    const loadShuttles = async () => {
        try {
            const res = await fetch('http://localhost:8099/api/v1/shuttle/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setShuttles(data);
        } catch (err) { 
            console.error("Failed to load shuttles", err); 
        }
    };

    const deleteShuttle = async (id) => {
        if (window.confirm('Are you sure you want to delete this shuttle?')) {
            try {
                const res = await fetch(`http://localhost:8099/api/v1/shuttle/delete/${id}`, { 
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    loadShuttles();
                } else {
                    alert("Delete failed.");
                }
            } catch (err) {
                console.error("Error deleting:", err);
            }
        }
    };

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
                    <li className="menu-item active" onClick={() => navigate('/admin-dashboard')}>Admin Home</li>
                    {allServices.map((service, index) => (
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
                        <h1>Administrator Control Panel</h1>
                        <p style={{opacity: 0.8}}>Logged in as ADMIN ({userName})</p>
                    </div>
                </header>

                <div className="dashboard-cards">
                    {allServices.map((service, index) => (
                        <div key={index} className="info-card">
                            <h3>{service.name}</h3>
                            <p>{service.desc}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button className="view-btn" onClick={() => navigate(service.path)}>
                                    Manage Service
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- SHUTTLE TABLE SECTION --- */}
                <div className="mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Shuttle Management Table</h2>
                        <button 
                            className="btn btn-success" 
                            onClick={() => navigate('/add-shuttle')}
                        >
                            + Add New Shuttle
                        </button>
                    </div>
                    
                    <div className="card shadow border-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-dark" style={{background: '#00482b'}}>
                                    <tr>
                                        <th>Bus Details</th>
                                        <th>Route</th>
                                        <th>Morning</th>
                                        <th>Evening</th>
                                        <th>Additional Details</th> {/* අලුතින් එක් කළ තීරුව */}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shuttles.length > 0 ? (
                                        shuttles.map(s => (
                                            <tr key={s.id}>
                                                <td><strong>{s.busName}</strong><br/><small>{s.busNumber}</small></td>
                                                <td>{s.route}</td>
                                                <td>{s.morningStartTime}</td>
                                                <td>{s.eveningDepartureTime}</td>
                                                {/* විස්තර වැඩිපුර තිබේ නම් UI එක කැඩෙන්නේ නැතිවීමට style එකතු කර ඇත */}
                                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {s.additionalDetails || <span className="text-muted">No details</span>}
                                                </td>
                                                <td>
                                                    <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/update-shuttle/${s.id}`)}>Edit</button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => deleteShuttle(s.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">No shuttles found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;