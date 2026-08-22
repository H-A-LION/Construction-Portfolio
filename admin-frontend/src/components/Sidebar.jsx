// src/admin/components/Sidebar.jsx
import React from 'react';

const Sidebar = ({ sections, activeSection, onSectionChange, onLogout }) => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-hard-hat"></i>
          <span>BuildPort</span>
        </div>
        <p className="sidebar-subtitle">Content Management</p>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => (
          <button
            key={section.id}
            className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => onSectionChange(section.id)}
          >
            <i className={`fas ${section.icon}`}></i>
            <span>{section.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item logout" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;