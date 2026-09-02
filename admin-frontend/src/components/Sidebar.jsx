// src/admin/components/Sidebar.jsx
import React, { useState } from 'react';
import { 
  GoSignOut, 
  GoHome, 
  GoGear, 
  GoStar, 
  GoInfo, 
  GoTools, 
  GoTasklist, 
  GoPeople, 
  GoMail,
  GoX
} from "react-icons/go";
import { FaBars } from "react-icons/fa";


const Sidebar = ({ sections, activeSection, onSectionChange, onLogout }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeSidebar = () => {
    setIsMobileOpen(false);
  };

  // Map section IDs to icons
  const getSectionIcon = (sectionId) => {
    const iconMap = {
      hero: GoStar,
      about: GoInfo,
      services: GoTools,
      projects: GoTasklist,
      team: GoPeople,
      contact: GoMail
    };
    return iconMap[sectionId] || GoGear;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isMobileOpen ? <GoX size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <div className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <i className="fas fa-hard-hat"></i>
            <span>BuildPort</span>
          </div>
          <p className="sidebar-subtitle">Content Management</p>
        </div>

        <nav className="sidebar-nav">
          {sections.map(section => {
            const Icon = getSectionIcon(section.id);
            return (
              <button
                key={section.id}
                className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => {
                  onSectionChange(section.id);
                  closeSidebar();
                }}
              >
                <Icon size={20} />
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-item logout" onClick={onLogout}>
            <GoSignOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;