import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import VerifyOTP from './VerifyOTP';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default path එක ලොගින් වලට හරවනවා */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Dashboard route එක */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* වැරදි path එකක් ආවොත් ලොගින් එකට */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;