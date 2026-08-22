// src/pages/Login.jsx
import React, { useState } from 'react';


const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo credentials
      if (credentials.email === 'admin@buildport.com' && credentials.password === 'admin123') {
        onLogin();
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <i className="fas fa-hard-hat"></i>
              <h1>BuildPort Admin</h1>
            </div>
            <p>Manage your portfolio content</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="admin@buildport.com"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-lock"></i>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Demo: admin@buildport.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;