import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/App.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: emailFromState,
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
      // Postman JSON: { "email": "...", "password": "...", "confirmPassword": "..." }
      const response = await axios.post('http://localhost:8099/api/v1/auth/reset-password', formData);
      
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
            <input 
              type="password" 
              placeholder="New Password" 
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Confirm New Password" 
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
        {message && <p className={`status-msg ${message.includes('✅') ? 'success' : 'error'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;