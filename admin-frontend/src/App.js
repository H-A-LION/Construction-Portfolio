// admin-frontend/src/App.js
import React, { useState, useEffect } from 'react';
import './index.scss';
import Login from './pages/Login';
import ContentManager from './pages/ContentManager';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('Checking auth - Token:', token ? 'exists' : 'none');
    console.log('Checking auth - User:', user ? 'exists' : 'none');
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard'); // Always go to dashboard (stats overview) first
      console.log('User authenticated, redirecting to dashboard');
    } else {
      // Clear any invalid session data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentPage('login');
      console.log('No valid session, redirecting to login');
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('Login successful, setting session');
    setIsAuthenticated(true);
    setCurrentPage('dashboard'); // Always go to dashboard (stats overview) after login
  };

  const handleLogout = () => {
    console.log('Logging out, clearing session');
    setIsAuthenticated(false);
    setCurrentPage('login');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Also clear any other stored data
    sessionStorage.clear();
  };

  const navigateToContentManager = () => {
    console.log('Navigating to Content Manager');
    setCurrentPage('contentmanager');
  };

  const navigateToDashboard = () => {
    console.log('Navigating to Dashboard');
    setCurrentPage('dashboard');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentPage === 'dashboard') {
    return (
      <Dashboard 
        onLogout={handleLogout} 
        onNavigateToContentManager={navigateToContentManager}
      />
    );
  }

  if (currentPage === 'contentmanager') {
    return (
      <ContentManager 
        onLogout={handleLogout}
        onBack={navigateToDashboard} 
      />
    );
  }

  // Fallback to dashboard
  return (
    <Dashboard 
      onLogout={handleLogout} 
      onNavigateToContentManager={navigateToContentManager}
    />
  );
}

export default App;