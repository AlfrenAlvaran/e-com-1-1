import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import './style/index.css'; 
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import About from './components/About';
import MarketplaceDashboard from './components/MarketplaceDashboard'; // Import the MarketplaceDashboard
import Checkout from './components/Checkout'; // Import the Checkout component

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/marketplace-dashboard" element={<MarketplaceDashboard />} /> {/* Route for MarketplaceDashboard */}
        <Route path="/checkout" element={<Checkout />} /> {/* Route for Checkout */}
        {/* ADD OTHER COMPONENTS HERE */}
      </Routes>
    </Router>
  );
}