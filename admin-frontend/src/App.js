// admin-frontend/src/App.js
import React, { useState } from 'react';
import './index.scss';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login'); // login, dashboard, admin

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
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
    return <Dashboard onLogout={handleLogout} onBack={navigateToDashboard} />;
  }

  return null;
}

export default App;