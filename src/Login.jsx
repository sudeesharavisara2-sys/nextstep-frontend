import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8099/api/v1/auth/login', {
                email: email,
                password: password
            });

            const token = response.data.accessToken;
            localStorage.setItem('token', token);
            
            alert("Welcome " + response.data.firstName);
            // Here you can redirect to the Dashboard
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>NextStep Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                    <button 
                        type="submit" 
                        className="btn btn-login"
                        disabled={loading}
                    >
                        {loading ? "Checking..." : "Login"}
                    </button>
                </form>
                <p className="switch-text">
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
