// admin-frontend/src/pages/Dashboard.jsx (was AdminDashboard.jsx)
import React, { useState, useEffect } from 'react';
import { 
  GoSignOut, 
  GoHome, 
  GoGear, 
  GoTasklist, 
  GoPeople, 
  GoTools,
  GoX,
  GoArrowRight,
  GoClock
} from "react-icons/go";
import { FaBars } from "react-icons/fa";

const Dashboard = ({ onLogout, onNavigateToContentManager }) => {
  const [stats, setStats] = useState({
    projects: 0,
    team: 0,
    services: 0,
    totalContent: 0
  });
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // You can fetch real stats from your API here
        // For now using demo data
        setStats({
          projects: 12,
          team: 8,
          services: 6,
          totalContent: 6
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeSidebar = () => {
    setIsMobileOpen(false);
  };

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
      {/* Mobile Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isMobileOpen ? <GoX size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <div className={`dashboard-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <i className="fas fa-hard-hat"></i>
            <span>BuildPort</span>
          </div>
          <p className="sidebar-subtitle">Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <button className="sidebar-item active">
            <GoHome size={20} />
            <span>Dashboard</span>
          </button>
          <button className="sidebar-item" onClick={() => {
            onNavigateToContentManager();
            closeSidebar();
          }}>
            <GoGear size={20} />
            <span>Content Manager</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-item logout" onClick={onLogout}>
            <GoSignOut size={20} />
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
          <button className="admin-btn-primary" onClick={onNavigateToContentManager}>
            <GoGear size={18} />
            Manage Content
          </button>
        </div>

        {/* Stats Grid - These were hidden before */}
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

        {/* Action Cards - These were hidden before */}
        <div className="dashboard-actions">
          <div className="action-card" onClick={onNavigateToContentManager}>
            <GoGear size={36} />
            <h4>Content Management</h4>
            <p>Edit all website content sections including images</p>
            <button className="action-btn">
              Go to Editor <GoArrowRight />
            </button>
          </div>
          <div className="action-card">
            <GoClock size={36} />
            <h4>Settings</h4>
            <p>Configure site settings and preferences</p>
            <button className="action-btn" disabled>
              Coming Soon <GoClock />
            </button>
          </div>
          <div className="action-card">
            <GoTasklist size={36} />
            <h4>Projects</h4>
            <p>Manage project portfolio</p>
            <button className="action-btn" onClick={onNavigateToContentManager}>
              Manage <GoArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;