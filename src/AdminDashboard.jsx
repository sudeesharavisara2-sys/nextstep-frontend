import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'bootstrap'; // Ensure bootstrap is installed via npm
import './Dashboard.css';
import './App.css'; // Importing your shuttle styles

const AdminDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Admin';
    const token = localStorage.getItem('token');

    // --- Shuttle Specific State ---
    const [shuttles, setShuttles] = useState([]);
    const [formData, setFormData] = useState({ 
        id: '', busName: '', busNumber: '', route: '', 
        morningStartTime: '', eveningDepartureTime: '', 
        phoneNumber: '', additionalDetails: '' 
    });
    const [shuttleModal, setShuttleModal] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        // Initialize Bootstrap Modal
        const modalElement = document.getElementById('shuttleModal');
        if (modalElement) {
            setShuttleModal(new Modal(modalElement));
        }
        loadShuttles();
    }, [token, navigate]);

    // --- Shuttle Logic Functions ---
    const loadShuttles = async () => {
        try {
            const res = await fetch('/api/shuttle/all');
            const data = await res.json();
            setShuttles(data);
        } catch (err) { console.error("Failed to load shuttles", err); }
    };

    const handleOpenModal = (shuttle = null) => {
        if (shuttle) {
            setFormData(shuttle);
        } else {
            setFormData({ id: '', busName: '', busNumber: '', route: '', morningStartTime: '', eveningDepartureTime: '', phoneNumber: '', additionalDetails: '' });
        }
        shuttleModal.show();
    };

    const handleShuttleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const res = await fetch('/api/shuttle/add', { method: 'POST', body: data });
        if (res.ok) {
            shuttleModal.hide();
            loadShuttles();
            alert("Successful!");
        }
    };

    const deleteShuttle = async (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            await fetch(`/api/shuttle/delete/${id}`, { method: 'DELETE' });
            loadShuttles();
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
                    <li className="menu-item" onClick={() => navigate('/admin-dashboard')}>Admin Home</li>
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
                                {service.name === "Shuttle Service" && (
                                    <button 
                                        className="view-btn" 
                                        style={{ background: '#006837', color: 'white', border: 'none' }}
                                        onClick={() => handleOpenModal()}
                                    >
                                        + Add New Shuttle
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- SHUTTLE TABLE SECTION --- */}
                <div className="mt-5">
                    <h2 className="mb-4">Shuttle Management Table</h2>
                    <div className="card shadow border-0">
                        <table className="table table-hover mb-0">
                            <thead className="table-dark" style={{background: '#00482b'}}>
                                <tr>
                                    <th>Bus Details</th>
                                    <th>Route</th>
                                    <th>Morning</th>
                                    <th>Evening</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shuttles.map(s => (
                                    <tr key={s.id}>
                                        <td><strong>{s.busName}</strong><br/><small>{s.busNumber}</small></td>
                                        <td>{s.route}</td>
                                        <td>{s.morningStartTime}</td>
                                        <td>{s.eveningDepartureTime}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleOpenModal(s)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteShuttle(s.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* --- SHUTTLE MODAL (Converted from your HTML) --- */}
            <div className="modal fade" id="shuttleModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <form className="modal-content" onSubmit={handleShuttleSubmit}>
                        <div className="modal-header text-white" style={{background: '#00482b'}}>
                            <h5 className="modal-title">{formData.id ? 'Edit Shuttle' : 'Add New Shuttle'}</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body p-4">
                            <input type="hidden" name="id" defaultValue={formData.id} />
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Bus Name</label>
                                    <input type="text" className="form-control" name="busName" defaultValue={formData.busName} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Bus Number</label>
                                    <input type="text" className="form-control" name="busNumber" defaultValue={formData.busNumber} required />
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label">Route</label>
                                    <input type="text" className="form-control" name="route" defaultValue={formData.route} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Morning Start Time</label>
                                    <input type="time" className="form-control" name="morningStartTime" defaultValue={formData.morningStartTime} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Evening Departure Time</label>
                                    <input type="time" className="form-control" name="eveningDepartureTime" defaultValue={formData.eveningDepartureTime} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Phone Number</label>
                                    <input type="text" className="form-control" name="phoneNumber" defaultValue={formData.phoneNumber} maxLength="10" required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Photos (Up to 3)</label>
                                    <input type="file" className="form-control" name="files" multiple accept="image/*" />
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label">Additional Details</label>
                                    <textarea className="form-control" name="additionalDetails" defaultValue={formData.additionalDetails} rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-success px-5">Save Shuttle</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;