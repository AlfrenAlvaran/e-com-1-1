// Register.jsx
import React, { useState } from 'react';

import '../style/register.css';
import { register } from '../utils/register';
import Navbar from './Navbar';

const Register = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(''); // Default to "buyer"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('User Type:', userType);
    try {
      const data = await register(firstname, lastname, email, password, userType);
      const { token } = data; // Assume your API returns a token

      // Store token in local storage
      localStorage.setItem('token', token);

      // Redirect to the buyer dashboard or any desired page after registration
      window.location.href = '/login';
    } catch (err) {
      setError(err.message); // Display error message
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">

        <h2>Register</h2>
        {error && <p className="error">{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstname">First Name:</label>
            <input
              type="text"
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Last Name:</label>
            <input
              type="text"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
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
          <select
            value={userType}
            onChange={(e) => {
              console.log('Selected User Type:', e.target.value); // Log selected value
              setUserType(e.target.value);
            }}

            required
            style={{
              backgroundColor: '#363636', // Dark gray background
              color: '#FFF',              // White text
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            <option value="">Select Role</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </>
  );
};

export default Register;