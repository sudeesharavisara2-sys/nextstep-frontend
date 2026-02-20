import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import '../../styles/Dashboard.css';
import '../../styles/ClubEvent.css';
import logo from "../../assets/logo1.png";

const ClubEventDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // --- State ---
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({ clubId: '', title: '', description: '', eventDate: '' });
  const [myEvents, setMyEvents] = useState([]);
  const [myJoinRequests, setMyJoinRequests] = useState([]);

  // --- Load Data ---
  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      loadClubs();
      loadMyEvents();
      loadMyJoinRequests();
    }
  }, [token, navigate]);

  const loadClubs = async () => {
    try {
      const res = await API.get('/clubs', { headers: { Authorization: `Bearer ${token}` } });
      setClubs(res.data);
    } catch (err) {
      console.error("Error fetching clubs:", err);
      if (err.response?.status === 401) navigate('/');
    }
  };

  const loadMyEvents = async () => {
    try {
      const res = await API.get('/events/my', { headers: { Authorization: `Bearer ${token}` } });
      setMyEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const loadMyJoinRequests = async () => {
    try {
      const res = await API.get('/clubs/my-requests', { headers: { Authorization: `Bearer ${token}` } });
      setMyJoinRequests(res.data);
    } catch (err) {
      console.error("Error fetching join requests:", err);
    }
  };

  // --- Join Club ---
  const handleJoinClub = async (club) => {
    const email = localStorage.getItem("email");
    try {
      const res = await API.post(
        '/clubs/join',
        { clubId: club.id, email: email },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      alert(res.data.message);
      setIsJoinModalOpen(false);
      loadMyJoinRequests();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to send join request");
    }
  };

  // --- Event Form ---
  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm({ ...eventForm, [name]: value });
  };

  const submitEventRequest = async () => {
    try {
      const payload = { ...eventForm, clubId: parseInt(eventForm.clubId) };
      const res = await API.post('/events/request', payload, { headers: { Authorization: `Bearer ${token}` } });
      alert(res.data.message);
      setIsEventModalOpen(false);
      setEventForm({ clubId: '', title: '', description: '', eventDate: '' });
      loadMyEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create event");
    }
  };

  const filteredClubs = clubs.filter(c =>
    c.clubName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="NextStep Logo" className="logo-img" />
        </div>
        <ul className="menu-list">
          <li className="menu-item" onClick={() => navigate('/dashboard')}>Home</li>
          <li className="menu-item active">Clubs & Events</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="shuttle-header">
          <h1>Clubs & Events</h1>
          <p>Explore university clubs, join them, and create events.</p>
        </header>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            className="shuttle-search-input"
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Clubs Cards */}
        <div className="dashboard-cards">
          {filteredClubs.map((club) => (
            <div key={club.id} className="glass-card">
              <h3>{club.clubName}</h3>
              <p>{club.description}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button className="submit-btn" onClick={() => { setSelectedClub(club); setIsJoinModalOpen(true); }}>Join Club</button>
                <button className="submit-btn" onClick={() => { setSelectedClub(club); setEventForm({ ...eventForm, clubId: club.id }); setIsEventModalOpen(true); }}>Create Event</button>
              </div>
            </div>
          ))}
        </div>

        {/* My Events */}
        <h2 style={{ marginTop: '30px' }}>My Events</h2>
        <div className="dashboard-cards">
          {myEvents.length === 0 && <p>No events yet</p>}
          {myEvents.map((event) => (
            <div key={event.id} className="glass-card">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>
              <span className={`status-badge ${event.status?.toLowerCase()}`}>{event.status}</span>
            </div>
          ))}
        </div>

        {/* My Club Requests */}
        <h2 style={{ marginTop: '30px' }}>My Club Requests</h2>
        <div className="dashboard-cards">
          {myJoinRequests.length === 0 && <p>No club requests yet</p>}
          {myJoinRequests.map((req) => (
            <div key={req.id} className="glass-card">
              <h3>{req.clubName}</h3>
              <span className={`status-badge ${req.status.toLowerCase()}`}>{req.status}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Join Club Modal */}
      {isJoinModalOpen && selectedClub && (
        <div className="modal-overlay" onClick={() => setIsJoinModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setIsJoinModalOpen(false)}>&times;</button>
            <h2>Join {selectedClub.clubName}</h2>
            <p>{selectedClub.description}</p>
            <button className="submit-btn" onClick={() => handleJoinClub(selectedClub)}>Confirm Join</button>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {isEventModalOpen && selectedClub && (
        <div className="modal-overlay" onClick={() => setIsEventModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setIsEventModalOpen(false)}>&times;</button>
            <h2>Create Event for {selectedClub.clubName}</h2>
            <form className="event-form">
              <input type="text" name="title" placeholder="Title" value={eventForm.title} onChange={handleEventInputChange} />
              <textarea name="description" placeholder="Description" value={eventForm.description} onChange={handleEventInputChange} />
              <input type="datetime-local" name="eventDate" value={eventForm.eventDate} onChange={handleEventInputChange} />
              <button type="button" className="submit-btn" onClick={submitEventRequest}>Submit Event Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubEventDashboard;