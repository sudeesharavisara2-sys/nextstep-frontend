import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); // New state for the OTP code
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Request OTP to the provided Email address
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8099/api/v1/auth/send-otp', { email });
      setMessage(`✅ ${response.data.message}`);
      setIsOtpSent(true); 
    } catch (error) {
      setMessage(error.response?.data?.message || '❌ Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit OTP and New Password to reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setLoading(false);
      return setMessage("❌ Passwords do not match!");
    }

    try {
      // Construct payload according to backend requirements
      const payload = { 
        email: email, 
        otp: otp, // Including the OTP in the payload
        password: password, 
        confirmPassword: confirmPassword 
      };

      const response = await axios.post('http://localhost:8099/api/v1/auth/reset-password', payload);
      
      setMessage('✅ Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2500);
    } catch (error) {
      console.error('❌ Reset Error:', error.response?.data);
      setMessage(error.response?.data?.message || '❌ Failed to reset password. Check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        
        {!isOtpSent ? (
          /* Step 1: Email Entry */
          <form onSubmit={handleSendOtp} className="auth-form">
            <p className="subtitle">Enter your email to receive an OTP</p>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          /* Step 2: Enter OTP and New Password */
          <form onSubmit={handleResetPassword} className="auth-form">
            <p className="subtitle" style={{color: '#006837'}}>OTP Sent to {email}</p>
            
            <div className="form-group">
              <label className="form-label">OTP Code</label>
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                className="form-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required 
                maxLength="6"
                style={{ textAlign: 'center', letterSpacing: '3px', fontWeight: 'bold' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
            
            <p className="switch-text" onClick={() => setIsOtpSent(false)} style={{cursor:'pointer', marginTop:'15px'}}>
              Go back to change email
            </p>
          </form>
        )}

        {message && (
          <p className={`status-msg ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;