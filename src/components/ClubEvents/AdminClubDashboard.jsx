import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import '../../styles/AddShuttle.css';
import logo from "../../assets/logo1.png";

const AdminClubDashboard = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [clubs, setClubs] = useState([]);
    const [clubRequests, setClubRequests] = useState([]);
    const [eventRequests, setEventRequests] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editClubId, setEditClubId] = useState(null);

    const [clubForm, setClubForm] = useState({
        clubName: '',
        description: ''
    });

    useEffect(() => {
        if (!token) {
            navigate('/');
        } else {
            loadClubs();
            loadClubRequests();
            loadEventRequests();
        }
    }, [token, navigate]);

    // ================= LOAD DATA =================

    const loadClubs = async () => {
        try {
            const res = await API.get('/clubs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClubs(res.data);
        } catch (err) {
            console.error("Load clubs error:", err);
        }
    };

    const loadClubRequests = async () => {
        try {
            const res = await API.get('/clubs/join/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClubRequests(res.data);
        } catch (err) {
            console.error("Club request load error:", err);
        }
    };

    const loadEventRequests = async () => {
        try {
            const res = await API.get('/events/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEventRequests(res.data);
        } catch (err) {
            console.error("Event request load error:", err);
        }
    };

    // ================= CLUB CRUD =================

    const handleClubChange = (e) => {
        const { name, value } = e.target;
        setClubForm({ ...clubForm, [name]: value });
    };

    const saveClub = async (e) => {
        e.preventDefault();

        try {
            if (editClubId) {
                await API.put(`/clubs/${editClubId}`, clubForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Club updated successfully!");
            } else {
                await API.post('/clubs', clubForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Club created successfully!");
            }

            setIsModalOpen(false);
            setEditClubId(null);
            setClubForm({ clubName: '', description: '' });
            loadClubs();

        } catch (err) {
            console.error("Save club error:", err);
        }
    };

    const editClub = (club) => {
        setEditClubId(club.id);
        setClubForm({
            clubName: club.clubName,
            description: club.description
        });
        setIsModalOpen(true);
    };

    const deleteClub = async (id) => {
        if (!window.confirm("Delete this club?")) return;

        try {
            await API.delete(`/clubs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadClubs();
        } catch (err) {
            console.error("Delete club error:", err);
        }
    };

    // ================= JOIN REQUEST ACTIONS =================

    const approveClubRequest = async (id) => {
        try {
            await API.put(`/clubs/join/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadClubRequests();
        } catch (err) {
            console.error("Approve error:", err);
        }
    };

    const declineClubRequest = async (id) => {
        if (!window.confirm("Decline this request?")) return;

        try {
            await API.delete(`/clubs/join/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadClubRequests();
        } catch (err) {
            console.error("Decline error:", err);
        }
    };

    // ================= EVENT ACTIONS =================

    const approveEvent = async (id) => {
        try {
            await API.put(`/events/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadEventRequests();
        } catch (err) {
            console.error("Approve event error:", err);
        }
    };

    const declineEvent = async (id) => {
        if (!window.confirm("Decline this event?")) return;

        try {
            await API.delete(`/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadEventRequests();
        } catch (err) {
            console.error("Decline event error:", err);
        }
    };

    // ================= UI =================

    return (
        <div className="shuttle-admin-page">

            <aside className="shuttle-sidebar">
                <h2>NEXTSTEP ADMIN</h2>
                <ul>
                    <li className="active">Club & Event Management</li>
                </ul>
                <button
                    className="btn-red"
                    style={{ marginTop: 'auto', padding: '10px' }}
                    onClick={() => { localStorage.clear(); navigate('/'); }}>
                    Logout
                </button>
            </aside>

            <main className="shuttle-main">

                <header className="shuttle-banner">
                    <h1>Admin Dashboard - Clubs & Events</h1>
                </header>

                <div className="shuttle-content">

                    {/* ================= ALL CLUBS ================= */}
                    <div className="shuttle-card">
                        <div className="shuttle-header-row">
                            <h2>All Clubs</h2>
                            <button className="btn-green" onClick={() => {
                                setEditClubId(null);
                                setClubForm({ clubName: '', description: '' });
                                setIsModalOpen(true);
                            }}>
                                + Add Club
                            </button>
                        </div>

                        <table className="shuttle-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clubs.map(club => (
                                    <tr key={club.id}>
                                        <td>{club.clubName}</td>
                                        <td>{club.description}</td>
                                        <td>
                                            <button className="btn-green" onClick={() => editClub(club)}>
                                                Edit
                                            </button>
                                            <button className="btn-red" onClick={() => deleteClub(club.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ================= JOIN REQUESTS ================= */}
                    <div className="shuttle-card">
                        <h2>Pending Club Join Requests</h2>
                        <table className="shuttle-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Club</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clubRequests.map(req => (
                                    <tr key={req.id}>
                                        <td>{req.email}</td>
                                        <td>{req.clubName}</td>
                                        <td>
                                            <button className="btn-green" onClick={() => approveClubRequest(req.id)}>
                                                Approve
                                            </button>
                                            <button className="btn-red" onClick={() => declineClubRequest(req.id)}>
                                                Decline
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ================= EVENT REQUESTS ================= */}
                    <div className="shuttle-card">
                        <h2>Pending Event Requests</h2>
                        <table className="shuttle-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventRequests.map(event => (
                                    <tr key={event.id}>
                                        <td>{event.title}</td>
                                        <td>{event.description}</td>
                                        <td>{event.eventDate}</td>
                                        <td>
                                            <button className="btn-green" onClick={() => approveEvent(event.id)}>
                                                Approve
                                            </button>
                                            <button className="btn-red" onClick={() => declineEvent(event.id)}>
                                                Decline
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>

            {/* ================= MODAL ================= */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>{editClubId ? "Edit Club" : "Create New Club"}</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                &times;
                            </button>
                        </div>

                        <form onSubmit={saveClub}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Club Name</label>
                                    <input
                                        type="text"
                                        name="clubName"
                                        value={clubForm.clubName}
                                        onChange={handleClubChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={clubForm.description}
                                        onChange={handleClubChange}
                                        rows="3"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="submit" className="btn-save-shuttle">
                                    {editClubId ? "Update Club" : "Save Club"}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminClubDashboard;