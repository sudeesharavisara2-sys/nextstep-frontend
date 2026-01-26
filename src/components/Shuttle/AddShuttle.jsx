<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';
import '../../styles/ShuttleService.css'; 

const AddShuttle = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        busName: '',
        busNumber: '',
        route: '',
        morningStartTime: '',
        eveningDepartureTime: '',
        phoneNumber: '',
        additionalDetails: '',
        photos: ['', '', ''] 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (index, value) => {
        const updatedPhotos = [...formData.photos];
        updatedPhotos[index] = value;
        setFormData({ ...formData, photos: updatedPhotos });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("New Shuttle Data:", formData);
        alert("Shuttle Added Successfully!");
        navigate('/admin-dashboard');
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo"><h2>NEXTSTEP ADMIN</h2></div>
                <button onClick={() => navigate(-1)} className="menu-item back-btn">⬅ Back</button>
            </aside>

            <main className="main-content">
                <header className="top-nav shuttle-header">
                    <h1>🚌 Add New Shuttle</h1>
                </header>

                <form className="info-card" style={{ textAlign: 'left', maxWidth: '800px' }} onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label>Bus Name</label>
                            <input name="busName" className="shuttle-search-input" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Bus Number</label>
                            <input name="busNumber" className="shuttle-search-input" onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Route (Start - End)</label>
                            <input name="route" className="shuttle-search-input" style={{ maxWidth: '100%' }} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Morning Start Time</label>
                            <input name="morningStartTime" type="time" className="shuttle-search-input" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Evening Departure Time</label>
                            <input name="eveningDepartureTime" type="time" className="shuttle-search-input" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Driver's Phone Number</label>
                            <input name="phoneNumber" className="shuttle-search-input" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Photos (Paste Image URLs)</label>
                        {formData.photos.map((photo, idx) => (
                            <input 
                                key={idx} 
                                placeholder={`Image URL ${idx + 1}`} 
                                className="shuttle-search-input" 
                                style={{ marginBottom: '10px', maxWidth: '100%' }} 
                                onChange={(e) => handlePhotoChange(idx, e.target.value)}
                            />
                        ))}
                    </div>

                    <div className="form-group">
                        <label>Additional Details</label>
                        <textarea name="additionalDetails" className="shuttle-search-input" style={{ maxWidth: '100%', height: '80px' }} onChange={handleChange}></textarea>
                    </div>

                    <button type="submit" className="call-driver-btn" style={{ marginTop: '20px' }}>
                        ✅ Save Shuttle Details
                    </button>
                </form>
            </main>
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api'; // api.js import කරන ලදී
import '../../styles/AddShuttle.css'; // Path එක නිවැරදි කරන ලදී

const AddShuttle = () => {
    const navigate = useNavigate();
    const [shuttles, setShuttles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedShuttleId, setSelectedShuttleId] = useState(null);
    const [formData, setFormData] = useState({
        busName: '', busNumber: '', route: '', morningStartTime: '',
        eveningDepartureTime: '', phoneNumber: '', additionalDetails: ''
    });

    const token = localStorage.getItem('token'); // Login හි save කළ නම 'token' වේ

    useEffect(() => { 
        if (!token) navigate('/'); 
        else loadShuttles(); 
    }, [token, navigate]);

    const loadShuttles = async () => {
        try {
            const res = await API.get('/shuttle/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setShuttles(res.data);
        } catch (err) { console.error("Load error:", err); }
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({ busName: '', busNumber: '', route: '', morningStartTime: '', eveningDepartureTime: '', phoneNumber: '', additionalDetails: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (shuttle) => {
        setIsEditMode(true);
        setSelectedShuttleId(shuttle.id);
        setFormData({ ...shuttle });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "phoneNumber") {
            const onlyNums = value.replace(/[^0-9]/g, '');
            if (onlyNums.length <= 10) {
                setFormData({ ...formData, [name]: onlyNums });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.phoneNumber.length !== 10) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }

        const endpoint = isEditMode 
            ? `/shuttle/update/${selectedShuttleId}`
            : '/shuttle/add';
        
        // Multipart/form-data සඳහා FormData object එක භාවිතා කිරීම
        const data = new FormData(e.target);

        try {
            const config = {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const res = isEditMode 
                ? await API.put(endpoint, data, config)
                : await API.post(endpoint, data, config);

            if (res.status === 200 || res.status === 201) {
                alert(isEditMode ? "Shuttle Updated Successfully!" : "Shuttle Added Successfully!");
                setIsModalOpen(false);
                loadShuttles();
            }
        } catch (error) { 
            console.error("Submit error:", error);
            alert("Operation failed. Please try again.");
        }
    };

    const deleteShuttle = async (id) => {
        if (window.confirm('Are you sure you want to delete this shuttle?')) {
            try {
                const res = await API.delete(`/shuttle/delete/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.status === 200) loadShuttles();
            } catch (err) { console.error("Delete error:", err); }
        }
    };

    return (
        <div className="shuttle-admin-page">
            <aside className="shuttle-sidebar">
                <h2>NEXTSTEP ADMIN</h2>
                <ul>
                    <li onClick={() => navigate('/admin-dashboard')}>Admin Home</li>
                    <li className="active">Shuttle Management</li>
                </ul>
                <button className="btn-red" style={{marginTop:'auto', padding:'10px'}} onClick={() => {localStorage.clear(); navigate('/');}}>Logout</button>
            </aside>

            <main className="shuttle-main">
                <header className="shuttle-banner">
                    <h1>Admin Dashboard - Shuttle Service</h1>
                </header>

                <div className="shuttle-content">
                    <div className="shuttle-header-row">
                        <h2>All Shuttles</h2>
                        <button className="btn-green" onClick={openAddModal}>+ Add New Shuttle</button>
                    </div>

                    <div className="shuttle-card">
                        <table className="shuttle-table">
                            <thead>
                                <tr>
                                    <th>Bus Details</th>
                                    <th>Route</th>
                                    <th>Morning</th>
                                    <th>Evening</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shuttles.map((s) => (
                                    <tr key={s.id}>
                                        <td><strong>{s.busName}</strong><br/><small>{s.busNumber}</small></td>
                                        <td>{s.route}</td>
                                        <td>{s.morningStartTime}</td>
                                        <td>{s.eveningDepartureTime}</td>
                                        <td>
                                            <button className="btn-yellow" onClick={() => openEditModal(s)}>Edit</button>
                                            <button className="btn-red" onClick={() => deleteShuttle(s.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>{isEditMode ? "Edit Shuttle Details" : "Add New Shuttle"}</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Bus Name</label>
                                        <input type="text" name="busName" value={formData.busName} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Bus Number</label>
                                        <input type="text" name="busNumber" value={formData.busNumber} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Route</label>
                                        <input type="text" name="route" value={formData.route} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Morning Start Time</label>
                                        <input type="time" name="morningStartTime" value={formData.morningStartTime} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Evening Departure Time</label>
                                        <input type="time" name="eveningDepartureTime" value={formData.eveningDepartureTime} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number (10 Digits)</label>
                                        <input 
                                            type="text" 
                                            name="phoneNumber" 
                                            value={formData.phoneNumber} 
                                            onChange={handleInputChange} 
                                            placeholder="07XXXXXXXX" 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Photos</label>
                                        <input type="file" name="files" multiple />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Additional Details</label>
                                        <textarea name="additionalDetails" value={formData.additionalDetails} onChange={handleInputChange} rows="2"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn-save-shuttle">
                                    {isEditMode ? "Save Changes" : "Save Shuttle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
>>>>>>> 88791749c61f2ad401908b7214a63db9fb5d6b91
        </div>
    );
};

export default AddShuttle;