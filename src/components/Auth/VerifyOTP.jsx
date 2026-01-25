import React, { useState } from 'react';
import API from '../../api'; // axios වෙනුවට API import කරන ලදී
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/App.css';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Retrieve the email passed from the Signup page state
    const emailFromSignup = location.state?.email || "";

    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Prepare the payload data as expected by the backend API
            const verifyData = {
                email: emailFromSignup,
                otp: otp
            };

            // API.post භාවිතා කර endpoint එක පමණක් ලබා දෙන ලදී
            const response = await API.post('/auth/verify', verifyData);

            setMessage('✅ Verification Successful! Redirecting to login...');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('❌ Verification Error:', error.response?.data);
            setMessage(error.response?.data?.message || '❌ Invalid OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Verify OTP</h2>
                <p className="subtitle">We've sent a code to {emailFromSignup}</p>
                
                <form onSubmit={handleVerify} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Enter OTP Code:</label>
                        <input
                            type="text"
                            placeholder="6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="form-input"
                            maxLength="6"
                            style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '5px' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                <div className="auth-footer">
                    <button className="resend-btn" onClick={() => alert('OTP Resent!')}>
                        Resend OTP
                    </button>
                </div>
                
                {message && (
                    <p className={`status-msg ${message.includes('Successful') ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default VerifyOtp;