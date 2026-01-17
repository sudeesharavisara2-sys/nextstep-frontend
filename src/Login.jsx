import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

const Login = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    
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
            
            console.log("Login Success:", response.data);
            
            // Backend එකෙන් එන Token එක Save කිරීම
            const token = response.data.accessToken || response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                // User ගේ විස්තරත් පසුවට ඕන වෙයි කියලා සේව් කරමු
                localStorage.setItem('userEmail', loginData.email);
            }

            setMessage("✅ Login Successful! Redirecting...");
            
            // පියවර 2: Token එක සේව් වුණාම කෙලින්ම Dashboard එකට
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (error) {
            console.error("Login Error:", error.response?.data);
            const errorData = error.response?.data;
            const errorMsg = errorData?.message || "Invalid Email or Password.";
            setMessage(`❌ ${errorMsg}`);
            
            if (errorMsg.includes("verified") || errorData?.status === "UNVERIFIED") {
                setTimeout(() => {
                    navigate('/verify-otp', { state: { email: loginData.email } });
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Welcome Back</h2>
                <p className="subtitle">Login to your account</p>
                
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                            name="email" 
                            type="email" 
                            className="form-input"
                            placeholder="example@gmail.com" 
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
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="forgot-password-link" style={{textAlign: 'right', marginBottom: '15px'}}>
                        <Link to="/forgot-password" style={{fontSize: '13px', color: '#006837'}}>Forgot Password?</Link>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Verifying..." : "Login"}
                    </button>

                    {message && (
                        <p className={`status-msg ${message.includes('✅') ? 'success' : 'error'}`}>
                            {message}
                        </p>
                    )}
                </form>

                <p className="switch-text">
                    Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;