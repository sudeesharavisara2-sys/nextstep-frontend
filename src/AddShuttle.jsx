import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddShuttle = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const res = await fetch('/api/shuttle/add', { method: 'POST', body: formData });

        if (res.ok) {
            alert("Shuttle Added Successfully!");
            navigate('/admin-dashboard'); // Go back to the table
        } else {
            alert("Error saving shuttle.");
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
                        <div className="col-md-6">
                            <button type="button" className="btn btn-secondary w-100" onClick={() => navigate('/admin-dashboard')}>Cancel</button>
                        </div>
                        <div className="col-md-6">
                            <button type="submit" className="btn btn-success w-100">Save Shuttle</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddShuttle;