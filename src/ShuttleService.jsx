import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './ShuttleService.css';

const ShuttleService = () => {
    const navigate = useNavigate();
    const [shuttles, setShuttles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal එක පාලනය කිරීමට State
    const [selectedShuttle, setSelectedShuttle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadShuttles();
    }, []);

    const loadShuttles = async () => {
        try {
            const res = await fetch('http://localhost:8099/api/v1/shuttle/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data = await res.json();
            setShuttles(data.sort((a, b) => a.route.localeCompare(b.route)));
        } catch (error) {
            console.error("Error loading shuttles:", error);
        }
    };

    const handleCardClick = (shuttle) => {
        setSelectedShuttle(shuttle);
        setIsModalOpen(true);
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
                        <div 
                            key={shuttle.id} 
                            className="info-card shuttle-clickable-card" 
                            onClick={() => handleCardClick(shuttle)}
                        >
                            <div className="shuttle-photo-gallery">
                                {shuttle.images && shuttle.images.length > 0 ? (
                                    <img 
                                        src={`data:image/jpeg;base64,${shuttle.images[0].imageData}`} 
                                        className="shuttle-img" 
                                        alt="bus" 
                                    />
                                ) : (
                                    <img src="https://via.placeholder.com/120" className="shuttle-img" alt="placeholder" />
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
                                        <label>MORNING</label>
                                        <span>{shuttle.morningStartTime}</span>
                                    </div>
                                    <div className="time-slot">
                                        <label>EVENING</label>
                                        <span>{shuttle.eveningDepartureTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* --- USER VIEW MODAL --- */}
            {isModalOpen && selectedShuttle && (
                <div className="shuttle-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="shuttle-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                        
                        <div className="modal-scrollable-area">
                            <h2 className="modal-bus-title">{selectedShuttle.busName}</h2>
                            <p className="modal-bus-sub">{selectedShuttle.busNumber} | {selectedShuttle.route}</p>

                            <div className="modal-image-strip">
                                {selectedShuttle.images && selectedShuttle.images.map((img, idx) => (
                                    <img 
                                        key={idx} 
                                        src={`data:image/jpeg;base64,${img.imageData}`} 
                                        alt="shuttle" 
                                        className="modal-large-img"
                                    />
                                ))}
                            </div>

                            <div className="modal-details-grid">
                                <div className="detail-item">
                                    <strong>Morning Start Time</strong>
                                    <p>{selectedShuttle.morningStartTime}</p>
                                </div>
                                <div className="detail-item">
                                    <strong>Evening Departure</strong>
                                    <p>{selectedShuttle.eveningDepartureTime}</p>
                                </div>
                                <div className="detail-item full-width">
                                    <strong>Contact Driver</strong>
                                    <button 
                                        className="modal-call-btn"
                                        onClick={() => window.location.href = `tel:${selectedShuttle.phoneNumber}`}
                                    >
                                        📞 Call {selectedShuttle.phoneNumber}
                                    </button>
                                </div>
                                {selectedShuttle.additionalDetails && (
                                    <div className="detail-item full-width">
                                        <strong>Additional Information</strong>
                                        <p className="details-text">{selectedShuttle.additionalDetails}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShuttleService;