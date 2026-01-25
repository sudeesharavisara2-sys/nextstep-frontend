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
        </div>
    );
};

export default AddShuttle;