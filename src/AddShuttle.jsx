import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddShuttle.css';

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

    const token = localStorage.getItem('accessToken');

    useEffect(() => { loadShuttles(); }, []);

    const loadShuttles = async () => {
        try {
            const res = await fetch('http://localhost:8099/api/v1/shuttle/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setShuttles(data);
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
        
        // Phone number එක ඉලක්කම් 10කට සීමා කිරීම සහ ඉලක්කම් පමණක් පිරවීමට ඉඩ දීම
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

        // Phone number එක ඉලක්කම් 10ක් දැයි පරීක්ෂා කිරීම
        if (formData.phoneNumber.length !== 10) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }

        const url = isEditMode 
            ? `http://localhost:8099/api/v1/shuttle/update/${selectedShuttleId}`
            : 'http://localhost:8099/api/v1/shuttle/add';
        
        const method = isEditMode ? 'PUT' : 'POST';
        const data = new FormData(e.target);

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (res.ok) {
                alert(isEditMode ? "Shuttle Updated Successfully!" : "Shuttle Added Successfully!");
                setIsModalOpen(false);
                loadShuttles();
            } else {
                alert("Operation failed. Please try again.");
            }
        } catch (error) { console.error("Submit error:", error); }
    };

    const deleteShuttle = async (id) => {
        if (window.confirm('Are you sure you want to delete this shuttle?')) {
            try {
                const res = await fetch(`http://localhost:8099/api/v1/shuttle/delete/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) loadShuttles();
            } catch (err) { console.error("Delete error:", err); }
        }
    };

    return (
        <div className="shuttle-admin-page">
            <aside className="shuttle-sidebar">
                <h2><span style={{color:'#198754'}}></span> NEXTSTEP ADMIN</h2>
                <ul>
                    <li onClick={() => navigate('/admin-dashboard')}>Admin Home</li>
                    <li className="active">Shuttle Management</li>
                </ul>
                <button className="btn-red" style={{marginTop:'auto', padding:'10px'}} onClick={() => {localStorage.clear(); navigate('/login');}}>Logout</button>
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
        </div>
    );
};

export default AddShuttle;