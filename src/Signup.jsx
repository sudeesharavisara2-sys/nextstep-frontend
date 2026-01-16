import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        gender: 'MALE',  // Default value
        role: 'USER'
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Send data to backend
            const response = await axios.post('http://localhost:8099/api/v1/auth/register', formData);
            setMessage("Registration successful! Please check your email for the OTP.");
            console.log("Success:", response.data);
        } catch (error) {
            setMessage("Registration failed: " + (error.response?.data?.message || "An error occurred while submitting data."));
            console.error("Error:", error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="subtitle">Join with NextStep Portal</p>
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label>First Name</label>
                        <input name="firstName" placeholder="John" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Last Name</label>
                        <input name="lastName" placeholder="Doe" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input name="email" type="email" placeholder="name@gmail.com" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input name="phoneNumber" placeholder="+94771234567" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Gender</label>
                        <select name="gender" onChange={handleChange} style={selectStyle}>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                    {message && (
                        <p className="switch-text" style={{color: message.includes('successful') ? '#006837' : 'red'}}>
                            {message}
                        </p>
                    )}
                </form>
                <p className="switch-text">
                    Already have an account? <a href="/">Login</a>
                </p>
            </div>
        </div>
    );
};

const selectStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: 'white'
};

export default Signup;
