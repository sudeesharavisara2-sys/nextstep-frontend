import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './ShuttleService.css';

const ShuttleService = () => {
    const navigate = useNavigate();
    const [shuttles, setShuttles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadShuttles();
    }, []);

    const loadShuttles = async () => {
        try {
            // Added 8099 port and v1 prefix to match your backend
            const res = await fetch('http://localhost:8099/api/v1/shuttle/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data = await res.json();
            // Sort A-Z by route
            setShuttles(data.sort((a, b) => a.route.localeCompare(b.route)));
        } catch (error) {
            console.error("Error loading shuttles:", error);
        }
    };

    const filteredShuttles = shuttles.filter(s => 
        (s.route && s.route.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.busName && s.busName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo"><h2>NEXTSTEP</h2></div>
                <ul className="menu-list">
                    <li className="menu-item" onClick={() => navigate('/dashboard')}>Home</li>
                    <li className="menu-item active">Shuttle Service</li>
                </ul>
                <div className="sidebar-note">
                    <strong>Note:</strong> Shuttle times may vary due to traffic conditions.
                </div>
            </aside>

            <main className="main-content">
                <header className="shuttle-header">
                    <h1>Shuttle Service</h1>
                    <p style={{ opacity: 0.7 }}>Find and track university shuttle routes.</p>
                </header>

                <div className="search-container">
                    <input 
                        type="text" 
                        className="shuttle-search-input" 
                        placeholder="Search by junction or bus name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="dashboard-cards">
                    {filteredShuttles.map((shuttle) => (
                        <div key={shuttle.id} className="info-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div className="shuttle-photo-gallery">
                                {shuttle.images && shuttle.images.length > 0 ? (
                                    shuttle.images.slice(0, 3).map((img, idx) => (
                                        <img 
                                            key={idx}
                                            src={`data:image/jpeg;base64,${img.imageData}`} 
                                            className="shuttle-img" 
                                            alt="bus" 
                                        />
                                    ))
                                ) : (
                                    <img src="https://via.placeholder.com/120" className="shuttle-img" style={{width: '100%'}} alt="placeholder" />
                                )}
                            </div>

                            <div className="shuttle-card-body">
                                <div className="shuttle-card-header">
                                    <h3 className="bus-name">{shuttle.busName}</h3>
                                    <span className="bus-number">{shuttle.busNumber}</span>
                                </div>
                                
                                <div className="shuttle-route">
                                    <i className="bi bi-geo-alt"></i> {shuttle.route}
                                </div>

                                <div className="time-grid">
                                    <div className="time-slot">
                                        <label>MORNING START</label>
                                        <span>{shuttle.morningStartTime}</span>
                                    </div>
                                    <div className="time-slot">
                                        <label>EVENING DEPT.</label>
                                        <span>{shuttle.eveningDepartureTime}</span>
                                    </div>
                                </div>

                                <button 
                                    className="call-driver-btn"
                                    onClick={() => window.location.href = `tel:${shuttle.phoneNumber}`}
                                >
                                    Call Driver
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ShuttleService;