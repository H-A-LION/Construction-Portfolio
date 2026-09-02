// admin-frontend/src/App.js
import React, { useState, useEffect } from 'react';
import './index.scss';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard'); // Default to dashboard view
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard'); // Show admin dashboard first
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const navigateToAdmin = () => {
    setCurrentPage('admin');
  };

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentPage === 'dashboard') {
    return (
      <AdminDashboard 
        onLogout={handleLogout} 
        onNavigateToAdmin={navigateToAdmin}
      />
    );
  }

  if (currentPage === 'admin') {
    return (
      <Dashboard 
        onLogout={handleLogout}
        onBack={navigateToDashboard} 
      />
    );
  }

  return null;
}

export default App;