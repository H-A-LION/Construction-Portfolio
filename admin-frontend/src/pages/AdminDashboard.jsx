// admin-frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { GoSignOut } from "react-icons/go";
import { fetchAllContent } from '../api/contentApi';

const AdminDashboard = ({ onLogout, onNavigateToAdmin }) => {
  const [stats, setStats] = useState({
    projects: 0,
    team: 0,
    services: 0,
    totalContent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const content = await fetchAllContent();
        setStats({
          projects: content.projects?.length || 0,
          team: content.team?.length || 0,
          services: content.services?.length || 0,
          totalContent: Object.keys(content).length || 0
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        // Set default stats
        setStats({
          projects: 4,
          team: 4,
          services: 6,
          totalContent: 6
        });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Content Sections',
      value: stats.totalContent,
      icon: 'fa-layer-group',
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: 'fa-tasks',
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      title: 'Team Members',
      value: stats.team,
      icon: 'fa-users',
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    },
    {
      title: 'Services',
      value: stats.services,
      icon: 'fa-wrench',
      color: '#10b981',
      bgColor: '#d1fae5'
    }
  ];

  return (
    <div className="admin-dashboard-wrapper">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <i className="fas fa-hard-hat"></i>
            <span>BuildPort</span>
          </div>
          <p className="sidebar-subtitle">Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <button className="sidebar-item active">
            <i className="fas fa-chart-pie"></i>
            <span>Dashboard</span>
          </button>
          <button className="sidebar-item" onClick={onNavigateToAdmin}>
            <i className="fas fa-edit"></i>
            <span>Content Manager</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-item logout" onClick={onLogout}>
            <GoSignOut />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h2>
            <i className="fas fa-chart-pie"></i>
            Dashboard Overview
          </h2>
          <button className="admin-btn-primary" onClick={onNavigateToAdmin}>
            <i className="fas fa-edit"></i>
            Manage Content
          </button>
        </div>

        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ background: stat.bgColor, color: stat.color }}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="stat-info">
                <h3>{loading ? '...' : stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-actions">
          <div className="action-card" onClick={onNavigateToAdmin}>
            <i className="fas fa-edit"></i>
            <h4>Content Management</h4>
            <p>Edit all website content sections</p>
            <button className="action-btn">
              Go to Editor <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="action-card">
            <i className="fas fa-cog"></i>
            <h4>Settings</h4>
            <p>Configure site settings</p>
            <button className="action-btn" disabled>
              Coming Soon <i className="fas fa-clock"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;