import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Assuming common layout styles
import './ShuttleService.css'; // Your new specific styles

const ShuttleService = () => {
    const navigate = useNavigate();
    const [shuttles, setShuttles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadShuttles();
    }, []);

    const loadShuttles = async () => {
        try {
            const res = await fetch('/api/shuttle/all');
            const data = await res.json();
            // Sort A-Z by route
            setShuttles(data.sort((a, b) => a.route.localeCompare(b.route)));
        } catch (error) {
            console.error("Error loading shuttles:", error);
        }
    };

    // Filter logic for the search bar
    const filteredShuttles = shuttles.filter(s => 
        s.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.busName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-layout">
            {/* Sidebar - Matching your PM's structure */}
            <aside className="sidebar">
                <div className="logo"><h2>NEXTSTEP</h2></div>
                <ul className="menu-list">
                    <li className="menu-item" onClick={() => navigate('/dashboard')}>Home</li>
                    <li className="menu-item active">Shuttle Service</li>
                </ul>
                <div className="sidebar-note">
                    <strong>Note:</strong> Shuttle times may vary due to traffic conditions. Please contact the driver for urgent inquiries.
                </div>
            </aside>

            <main className="main-content">
                <header className="shuttle-header">
                    <h1>Shuttle Service</h1>
                    <p style={{ opacity: 0.7 }}>Find and track your university shuttle routes.</p>
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
                            {/* Photo Gallery - Shows up to 3 images */}
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

                                <p className="shuttle-details">
                                    {shuttle.additionalDetails || "No additional info available."}
                                </p>

                                <button 
                                    className="call-driver-btn"
                                    onClick={() => window.location.href = `tel:${shuttle.phoneNumber}`}
                                >
                                    <i className="bi bi-telephone-outbound"></i> Call Driver
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredShuttles.length === 0 && (
                    <div className="text-center mt-5" style={{opacity: 0.5}}>
                        <p>No shuttles found matching your search.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ShuttleService;