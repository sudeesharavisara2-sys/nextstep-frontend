import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api'; // Axios instance
import '../../styles/Dashboard.css';
import '../../styles/ShuttleService.css'; // reuse for card/modal styling
import logo from "../../assets/logo1.png";

const AdminClubDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // --- State Management ---
    const [clubs, setClubs] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [eventRequests, setEventRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClub, setSelectedClub] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClubName, setNewClubName] = useState('');
    const [newClubDesc, setNewClubDesc] = useState('');

    useEffect(() => {
        if (!token) navigate('/');
        else {
            loadClubs();
            loadJoinRequests();
            loadEventRequests();
        }
    }, [token, navigate]);

    // --- API Calls ---
    const loadClubs = async () => {
        try {
            const res = await API.get('/clubs', { headers: { Authorization: `Bearer ${token}` } });
            setClubs(res.data);
        } catch (err) {
            console.error("Error loading clubs:", err);
        }
    };

    const loadJoinRequests = async () => {
        try {
            const res = await API.get('/clubs/join/pending', { headers: { Authorization: `Bearer ${token}` } });
            setJoinRequests(res.data);
        } catch (err) {
            console.error("Error loading join requests:", err);
        }
    };

    const loadEventRequests = async () => {
        try {
            const res = await API.get('/events/pending', { headers: { Authorization: `Bearer ${token}` } });
            setEventRequests(res.data);
        } catch (err) {
            console.error("Error loading event requests:", err);
        }
    };

    const handleApproveJoin = async (id) => {
        try {
            await API.put(`/clubs/join/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
            loadJoinRequests();
        } catch (err) {
            console.error("Error approving join request:", err);
        }
    };

    const handleDeclineJoin = async (id) => {
        try {
            await API.put(`/clubs/join/${id}/decline`, {}, { headers: { Authorization: `Bearer ${token}` } });
            loadJoinRequests();
        } catch (err) {
            console.error("Error declining join request:", err);
        }
    };

    const handleApproveEvent = async (id) => {
        try {
            await API.put(`/events/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
            loadEventRequests();
        } catch (err) {
            console.error("Error approving event:", err);
        }
    };

    const handleDeclineEvent = async (id) => {
        try {
            await API.put(`/events/${id}/decline`, {}, { headers: { Authorization: `Bearer ${token}` } });
            loadEventRequests();
        } catch (err) {
            console.error("Error declining event:", err);
        }
    };

    const handleCreateClub = async () => {
        if (!newClubName || !newClubDesc) return;
        try {
            await API.post('/clubs', { clubName: newClubName, description: newClubDesc }, { headers: { Authorization: `Bearer ${token}` } });
            setNewClubName('');
            setNewClubDesc('');
            loadClubs();
        } catch (err) {
            console.error("Error creating club:", err);
        }
    };

    const filteredClubs = clubs.filter(c => c.clubName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo"><img src={logo} alt="NextStep Logo" className="logo-img" /></div>
                <ul className="menu-list">
                    <li className="menu-item active">Admin Dashboard</li>
                </ul>
            </aside>

            <main className="main-content">
                <header className="shuttle-header">
                    <h1>Club & Event Management</h1>
                    <p>Create clubs, approve join requests, and manage events.</p>
                </header>

                <div className="search-container">
                    <input
                        type="text"
                        className="shuttle-search-input"
                        placeholder="Search clubs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="dashboard-cards">
                    {filteredClubs.map(club => (
                        <div key={club.id} className="info-card shuttle-clickable-card" onClick={() => { setSelectedClub(club); setIsModalOpen(true); }}>
                            <h3>{club.clubName}</h3>
                            <p>{club.description}</p>
                        </div>
                    ))}

                    <div className="info-card">
                        <h3>Create New Club</h3>
                        <input type="text" placeholder="Club Name" value={newClubName} onChange={(e) => setNewClubName(e.target.value)} />
                        <textarea placeholder="Description" value={newClubDesc} onChange={(e) => setNewClubDesc(e.target.value)} />
                        <button onClick={handleCreateClub}>Create Club</button>
                    </div>
                </div>

                {/* --- JOIN REQUESTS --- */}
                <section className="requests-section">
                    <h2>Pending Join Requests</h2>
                    {joinRequests.map(req => (
                        <div key={req.id} className="info-card">
                            <p><strong>Student:</strong> {req.email}</p>
                            <p><strong>Club:</strong> {req.clubName}</p>
                            <div className="card-actions">
                                <button onClick={() => handleApproveJoin(req.id)}>Approve</button>
                                <button onClick={() => handleDeclineJoin(req.id)}>Decline</button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* --- EVENT REQUESTS --- */}
                <section className="requests-section">
                    <h2>Pending Event Requests</h2>
                    {eventRequests.map(ev => (
                        <div key={ev.id} className="info-card">
                            <p><strong>Title:</strong> {ev.title}</p>
                            <p><strong>Club:</strong> {ev.clubName}</p>
                            <p><strong>Date:</strong> {new Date(ev.eventDate).toLocaleString()}</p>
                            <div className="card-actions">
                                <button onClick={() => handleApproveEvent(ev.id)}>Approve</button>
                                <button onClick={() => handleDeclineEvent(ev.id)}>Decline</button>
                            </div>
                        </div>
                    ))}
                </section>

            </main>

            {/* --- MODAL --- */}
            {isModalOpen && selectedClub && (
                <div className="shuttle-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="shuttle-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                        <h2>{selectedClub.clubName}</h2>
                        <p>{selectedClub.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminClubDashboard;
