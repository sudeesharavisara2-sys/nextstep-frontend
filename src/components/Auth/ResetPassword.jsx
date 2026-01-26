import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
=======
import API from '../../api'; // Import API instead of axios
>>>>>>> 88791749c61f2ad401908b7214a63db9fb5d6b91
import '../../styles/App.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve email and otp sent from ForgotPassword or VerifyOTP state
  const emailFromState = location.state?.email || "";
  const otpFromState = location.state?.otp || ""; 

  const [formData, setFormData] = useState({
    email: emailFromState,
    otp: otpFromState, // Include OTP if required by the backend
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      return setMessage("❌ Passwords do not match!");
    }

    try {
      // Use the API instance for the request
      const response = await API.post('/auth/reset-password', formData);
      
      setMessage('✅ Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('❌ Reset Error:', error.response?.data);
      setMessage(error.response?.data?.message || '❌ Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">New Password</h2>
        <p className="subtitle">Resetting password for {formData.email}</p>
        
        <form onSubmit={handleReset} className="auth-form">
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="form-input"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
        {message && (
          <p className={`status-msg ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;