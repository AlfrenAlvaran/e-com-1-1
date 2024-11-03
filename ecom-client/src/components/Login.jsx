// Login.jsx
import React, { useState } from 'react';

import '../style/login.css' // Import your styles
import { login } from '../utils/login';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      const { token, userType  } = data; // Adjust based on your API response
      localStorage.setItem('token', token); // Store token in local storage
      switch (userType) {
        case 'admin':
          window.location.href = '/admin-dashboard';
          break;
        default:
          window.location.href = '/marketplace-dashboard'; // Redirect to MarketplaceDashboard for all other user types
          break;
      }
      
    } catch (err) {
      setError(err.message); // Display error message
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
    <Navbar/>
    <div className="login-container">
    
      <h2>Login</h2>
      {error && <p className="error">{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>

      <p className="signup-link">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
   </>
  );
};

export default Login;