import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';
import '../../styles/ShuttleService.css'; 

const ShuttleService = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const shuttleData = [
        { 
            id: 1, 
            busName: "Campus Express",
            busNumber: "NB-4567",
            route: "Main Campus to Town", 
            morningStartTime: "07:30 AM", 
            eveningDepartureTime: "04:45 PM",
            phoneNumber: "0712345678", 
            additionalDetails: "Stops at Railway Station and Public Library.",
            photos: [
                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400",
                "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400",
                "https://images.unsplash.com/photo-1562620644-859514988f5c?w=400"
            ]
        },
        { 
            id: 2, 
            busName: "Scholar Shuttle",
            busNumber: "WP-8821",
            route: "Hostel to Faculty Complex", 
            morningStartTime: "08:15 AM", 
            eveningDepartureTime: "05:15 PM",
            phoneNumber: "0778899001", 
            additionalDetails: "Direct route, no intermediate stops.",
            photos: [
                "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400",
                "https://images.unsplash.com/photo-1557223562-1c77ff16e5da?w=400",
                "https://images.unsplash.com/photo-1494510614407-68c073b37887?w=400"
            ]
        }
    ];

    const filteredShuttles = shuttleData.filter(shuttle => 
        shuttle.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shuttle.busName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo"><h2>NEXTSTEP</h2></div>
                <button onClick={() => navigate(-1)} className="menu-item back-btn">
                    ⬅ Back to Dashboard
                </button>
                <div className="sidebar-note">
                    <strong>Note:</strong> Timings may vary slightly depending on traffic. Contact driver for updates.
                </div>
            </aside>

            <main className="main-content">
                <header className="top-nav shuttle-header">
                    <div>
                        <h1>Bus Shuttle Service</h1>
                        <p>Search routes and view bus details</p>
                    </div>
                </header>

                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search by Bus Name or Route..." 
                        className="shuttle-search-input"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="dashboard-cards">
                    {filteredShuttles.map((shuttle) => (
                        <div key={shuttle.id} className="info-card shuttle-card">
                            
                            <div className="shuttle-photo-gallery">
                                {shuttle.photos.map((img, idx) => (
                                    <img key={idx} src={img} alt="Bus" className="shuttle-img" />
                                ))}
                            </div>

                            <div className="shuttle-card-body">
                                <div className="shuttle-card-header">
                                    <h3 className="bus-name">{shuttle.busName}</h3>
                                    <span className="bus-number">{shuttle.busNumber}</span>
                                </div>

                                <p className="shuttle-route">Route: {shuttle.route}</p>
                                
                                <div className="time-grid">
                                    <div className="time-slot">
                                        <label>MORNING START</label>
                                        <span>{shuttle.morningStartTime}</span>
                                    </div>
                                    <div className="time-slot">
                                        <label>EVENING DEPARTURE</label>
                                        <span>{shuttle.eveningDepartureTime}</span>
                                    </div>
                                </div>

                                <p className="shuttle-details"><strong>Details:</strong> {shuttle.additionalDetails}</p>
                                
                                <button 
                                    className="call-driver-btn"
                                    onClick={() => window.open(`tel:${shuttle.phoneNumber}`)}
                                >
                                    Call Driver ({shuttle.phoneNumber})
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