import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api'; // api.js import කරන ලදී
import '../../styles/Dashboard.css'; // Path එක නිවැරදි කරන ලදී
import '../../styles/ShuttleService.css'; // Path එක නිවැරදි කරන ලදී

const ShuttleService = () => {
    const navigate = useNavigate();

    // --- State Management ---
    const [shuttles, setShuttles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedShuttle, setSelectedShuttle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const token = localStorage.getItem('token'); // 'token' ලෙස ලබා ගැනීම

    useEffect(() => {
        if (!token) navigate('/');
        else loadShuttles();
    }, [token, navigate]);

    // --- Keyboard Navigation Logic ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((isModalOpen || isLightboxOpen) && selectedShuttle?.images?.length > 1) {
                if (e.key === 'ArrowRight') nextImage();
                else if (e.key === 'ArrowLeft') prevImage();
            }
            if (e.key === 'Escape') {
                setIsModalOpen(false);
                setIsLightboxOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, isLightboxOpen, selectedShuttle]);

    // --- Image Auto-play Logic ---
    useEffect(() => {
        let interval;
        if (isModalOpen && !isLightboxOpen && selectedShuttle?.images?.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prev) =>
                    prev === selectedShuttle.images.length - 1 ? 0 : prev + 1
                );
            }, 3500);
        }
        return () => clearInterval(interval);
    }, [isModalOpen, isLightboxOpen, selectedShuttle]);

    const loadShuttles = async () => {
        try {
            // API instance එක භාවිතා කර දත්ත ලබා ගැනීම
            const res = await API.get('/shuttle/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setShuttles(res.data.sort((a, b) => a.route.localeCompare(b.route)));
        } catch (error) {
            console.error("Error loading shuttles:", error);
        }
    };

    const handleCardClick = (shuttle) => {
        setSelectedShuttle(shuttle);
        setCurrentImageIndex(0);
        setIsModalOpen(true);
    };

    const nextImage = (e) => {
        if (e) e.stopPropagation();
        if (selectedShuttle?.images?.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === selectedShuttle.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        if (selectedShuttle?.images?.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedShuttle.images.length - 1 : prev - 1
            );
        }
    };

    const filteredShuttles = shuttles.filter(s =>
        (s.route?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.busName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo"><h2>NEXTSTEP</h2></div>
                <ul className="menu-list">
                    <li className="menu-item" onClick={() => navigate('/dashboard')}>Home</li>
                    <li className="menu-item active">Shuttle Service</li>
                </ul>
            </aside>

            <main className="main-content">
                <header className="shuttle-header">
                    <h1>Shuttle Service</h1>
                    <p>Find and track university shuttle routes.</p>
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
                        <div key={shuttle.id} className="info-card shuttle-clickable-card" onClick={() => handleCardClick(shuttle)}>
                            <div className="shuttle-card-top-header">
                                <h3 className="bus-name">{shuttle.busName}</h3>
                            </div>

                            <div className="shuttle-photo-gallery">
                                {shuttle.images?.[0] ? (
                                    <img src={`data:image/jpeg;base64,${shuttle.images[0].imageData}`} className="shuttle-img" alt="bus" />
                                ) : (
                                    <img src="https://via.placeholder.com/120" className="shuttle-img" alt="placeholder" />
                                )}
                            </div>

                            <div className="shuttle-card-body">
                                <div className="shuttle-route">{shuttle.route}</div>
                                <div className="shuttle-card-info-container">
                                    <div className="card-times-split">
                                        <div className="time-sub-block">
                                            <span className="label">Morning</span>
                                            <span className="value">{shuttle.morningStartTime}</span>
                                        </div>
                                        <div className="time-divider"></div>
                                        <div className="time-sub-block">
                                            <span className="label">Evening</span>
                                            <span className="value">{shuttle.eveningDepartureTime}</span>
                                        </div>
                                    </div>
                                    <div className="card-phone-wrapper">
                                        <a
                                            href={`tel:${shuttle.phoneNumber}`}
                                            className="card-call-action"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            📞 {shuttle.phoneNumber}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* --- POP-UP MODAL --- */}
            {isModalOpen && selectedShuttle && (
                <div className="shuttle-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="shuttle-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                        <div className="modal-scrollable-area">
                            <h2 className="modal-bus-title">{selectedShuttle.busName}</h2>
                            <p className="modal-bus-sub">{selectedShuttle.busNumber} | {selectedShuttle.route}</p>
                            <div className="modal-image-container">
                                {selectedShuttle.images?.[currentImageIndex] ? (
                                    <>
                                        <img
                                            key={currentImageIndex}
                                            src={`data:image/jpeg;base64,${selectedShuttle.images[currentImageIndex].imageData}`}
                                            alt="shuttle"
                                            className="modal-large-img"
                                            onClick={() => setIsLightboxOpen(true)}
                                        />
                                        {selectedShuttle.images.length > 1 && (
                                            <>
                                                <button className="slider-btn prev" onClick={prevImage}>❮</button>
                                                <button className="slider-btn next" onClick={nextImage}>❯</button>
                                            </>
                                        )}
                                    </>
                                ) : <p>No images</p>}
                            </div>
                            <div className="modal-details-grid">
                                <div className="detail-item">
                                    <strong>Morning Start</strong>
                                    <p>{selectedShuttle.morningStartTime}</p>
                                </div>
                                <div className="detail-item">
                                    <strong>Evening Departure</strong>
                                    <p>{selectedShuttle.eveningDepartureTime}</p>
                                </div>
                                <div className="detail-item full-width">
                                    <strong>Contact Driver</strong>
                                    <button className="modal-call-btn" onClick={() => window.location.href = `tel:${selectedShuttle.phoneNumber}`}>
                                        📞 Call {selectedShuttle.phoneNumber}
                                    </button>
                                </div>
                                {selectedShuttle.additionalDetails && (
                                    <div className="detail-item full-width">
                                        <strong>Additional Information</strong>
                                        <div className="details-text">
                                            {selectedShuttle.additionalDetails}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- LIGHTBOX --- */}
            {isLightboxOpen && selectedShuttle && (
                <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
                    <span className="close-lightbox" onClick={() => setIsLightboxOpen(false)}>&times;</span>
                    <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
                        <img
                            key={currentImageIndex}
                            src={`data:image/jpeg;base64,${selectedShuttle.images[currentImageIndex].imageData}`}
                            className="lightbox-img"
                            alt="Full Screen"
                        />
                        {selectedShuttle.images.length > 1 && (
                            <>
                                <button className="lightbox-btn lb-prev" onClick={prevImage}>❮</button>
                                <button className="lightbox-btn lb-next" onClick={nextImage}>❯</button>
                                <div className="lightbox-counter">
                                    {currentImageIndex + 1} / {selectedShuttle.images.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShuttleService;