import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api'; // api.js නිවැරදිව import කරගන්න
import '../../styles/App.css'; 

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
            // API instance එක භාවිතා කර backend එකට සම්බන්ධ වීම
            const response = await API.post('/auth/login', loginData);
            
            // Backend එකෙන් ලැබෙන දත්ත ලබා ගැනීම
            const { accessToken, token, role, firstName } = response.data;
            const finalToken = accessToken || token;

            if (finalToken) {
                // Token සහ අනෙකුත් විස්තර localStorage හි ගබඩා කිරීම
                localStorage.setItem('token', finalToken);
                localStorage.setItem('userRole', role); // 'ADMIN' හෝ 'USER'
                localStorage.setItem('userName', firstName || 'User');
                
                setMessage("✅ Login Successful! Redirecting...");

                // Role එක අනුව අදාළ Dashboard එකට යොමු කිරීම
                setTimeout(() => {
                    if (role === 'ADMIN') {
                        navigate('/admin-dashboard');
                    } else {
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
                        <input 
                            name="email" 
                            type="email" 
                            className="form-input" 
                            placeholder="example@gmail.com" 
                            value={loginData.email}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            className="form-input" 
                            placeholder="••••••••" 
                            value={loginData.password}
                            onChange={handleChange} 
                            required 
                        />
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