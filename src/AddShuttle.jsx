import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddShuttle = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const res = await fetch('http://localhost:8099/api/v1/shuttle/add', { 
                method: 'POST', 
                headers: {
                    // Added token from localStorage
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formData 
            });

            if (res.ok) {
                alert("Shuttle Added Successfully!");
                navigate('/admin-dashboard'); 
            } else {
                const errorData = await res.text();
                alert("Error: " + errorData);
            }
        } catch (error) {
            console.error("Connection error:", error);
            alert("Could not connect to server.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow border-0 p-4">
                <h2 className="mb-4" style={{color: '#00482b'}}>Add New Shuttle</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Bus Name</label>
                            <input type="text" className="form-control" name="busName" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Bus Number</label>
                            <input type="text" className="form-control" name="busNumber" required />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Route</label>
                            <input type="text" className="form-control" name="route" required />
                        </div>
                        {/* New Fields added to match your JSON structure */}
                        <div className="col-md-6">
                            <label className="form-label">Morning Start Time</label>
                            <input type="text" className="form-control" name="morningStartTime" placeholder="e.g. 06:30 AM" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Evening Departure Time</label>
                            <input type="text" className="form-control" name="eveningDepartureTime" placeholder="e.g. 05:15 PM" />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Phone Number</label>
                            <input type="text" className="form-control" name="phoneNumber" required />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Upload Images</label>
                            <input type="file" className="form-control" name="files" multiple />
                        </div>
                        <div className="col-md-6 mt-4">
                            <button type="button" className="btn btn-secondary w-100" onClick={() => navigate('/admin-dashboard')}>Cancel</button>
                        </div>
                        <div className="col-md-6 mt-4">
                            <button type="submit" className="btn btn-success w-100">Save Shuttle</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddShuttle;