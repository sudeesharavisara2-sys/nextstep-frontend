import React, { useState } from 'react';
import API from '../../api'; // axios වෙනුවට අපේ api.js එක import කරගන්න
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
    role: 'USER', // Set USER as the default role
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // API.post භාවිතා කර කෙටි URL එකක් ලබා දීම
      const response = await API.post('/auth/register', formData);

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
        <form onSubmit={handleSignup} className="auth-form">
          
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

          {/* Gender Selection Section */}
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

          {/* User Role Selection Section */}
          <div className="role-row">
            <label className="form-label-inline">Role:</label>
            <select name="role" value={formData.role} onChange={handleChange} className="select-input" style={{flex: 1}}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
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