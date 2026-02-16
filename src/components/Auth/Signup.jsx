import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/App.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: 'MALE',
    role: 'USER',
  });

  const [adminKey, setAdminKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Define your secret key here
  const SECRET_ADMIN_CODE = "ADMIN123";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Verification logic
    if (formData.role === 'ADMIN' && adminKey !== SECRET_ADMIN_CODE) {
      setMessage('❌ Invalid Admin Secret Key!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8099/api/v1/auth/register',
        formData
      );

      console.log('✅ Registration Success:', response.data);
      setMessage('✅ Success! Redirecting to OTP verification...');

      setTimeout(() => {
        navigate('/verify-otp', { state: { email: formData.email } });
      }, 1500);
    } catch (error) {
      console.error('❌ Error Response:', error.response?.data);
      setMessage(error.response?.data?.message || '❌ Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <form onSubmit={handleSignup} className="auth-form" autoDiscard="off">

          <div className="form-group">
            <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <input name="phoneNumber" placeholder="Phone (+94...)" value={formData.phoneNumber} onChange={handleChange} required className="form-input" />
          </div>

          <div className="gender-row">
            <label className="form-label-inline">Gender:</label>
            <div className="radio-options">
              <label className="radio-option">
                <input type="radio" name="gender" value="MALE" checked={formData.gender === 'MALE'} onChange={handleChange} /> Male
              </label>
              <label className="radio-option">
                <input type="radio" name="gender" value="FEMALE" checked={formData.gender === 'FEMALE'} onChange={handleChange} /> Female
              </label>
            </div>
          </div>

          <div className="role-row">
            <label className="form-label-inline">Role:</label>
            <select name="role" value={formData.role} onChange={handleChange} className="select-input" style={{flex: 1}}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Admin Key Field with auto-complete disabled */}
          {formData.role === 'ADMIN' && (
            <div className="form-group">
              <input 
                type="password" 
                name="admin_secret_field"
                placeholder="Enter Admin Secret Key" 
                value={adminKey} 
                onChange={(e) => setAdminKey(e.target.value)} 
                required 
                className="form-input admin-input"
                autoComplete="new-password" 
                style={{ border: '1px solid #ff4d4f', backgroundColor: '#fff1f0' }}
              />
            </div>
          )}

          <div className="form-group">
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="form-input" />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>

          {message && <p className={`status-msg ${message.includes('Success') ? 'success' : 'error'}`}>{message}</p>}
        </form>

        <div className="auth-footer">
          <p className="switch-text">Already have an account? <Link to="/" className="auth-link">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;