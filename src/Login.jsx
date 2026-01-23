import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

const Login = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:8099/api/v1/auth/login', loginData);
            
            // Destructure data
            const { accessToken, token, role, firstName } = response.data;
            
            // 1. Token එක තහවුරු කරගැනීම
            const finalToken = accessToken || token;

            if (finalToken) {
                // 2. LocalStorage එකේ දත්ත තැන්පත් කිරීම
                // AdminDashboard එකේ පාවිච්චි කරන්නේ 'accessToken' හෝ 'token' ද යන්න තහවුරු කරගන්න
                localStorage.setItem('accessToken', finalToken); 
                localStorage.setItem('token', finalToken); // Safe side එකට දෙකම save කරන්න
                localStorage.setItem('userRole', role); 
                localStorage.setItem('userName', firstName || 'User');
                
                setMessage("✅ Login Successful! Redirecting...");

                // 3. Role-based Navigation logic එක පරීක්ෂා කිරීම
                // Backend එකෙන් එන්නේ "ADMIN" ද නැත්නම් "ROLE_ADMIN" ද යන්න මෙහිදී වැදගත් වේ.
                setTimeout(() => {
                    const userRole = role ? role.toUpperCase() : "";
                    
                    if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
                        console.log("Navigating to Admin Dashboard...");
                        navigate('/admin-dashboard');
                    } else {
                        console.log("Navigating to User Dashboard...");
                        navigate('/dashboard');
                    }
                }, 1000);
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data);
            const errorMsg = error.response?.data?.message || "Invalid Email or Password.";
            setMessage(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">WELCOME BACK</h2>
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input name="email" type="email" className="form-input" placeholder="example@gmail.com" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input name="password" type="password" className="form-input" placeholder="••••••••" onChange={handleChange} required />
                    </div>
                    <div className="forgot-password-link" style={{textAlign: 'right', marginBottom: '15px'}}>
                        <Link to="/forgot-password" style={{color: '#006837', fontSize: '13px'}}>Forgot Password?</Link>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Verifying..." : "Login"}
                    </button>
                    {message && <p className={`status-msg ${message.includes('✅') ? 'success' : 'error'}`}>{message}</p>}
                </form>
                <p className="switch-text">Don't have an account? <Link to="/signup" style={{color: '#006837', fontWeight: 'bold'}}>Sign Up</Link></p>
            </div>
        </div>
    );
};

export default Login;