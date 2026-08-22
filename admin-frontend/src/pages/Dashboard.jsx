// src/admin/pages/Dashboard.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ContentEditor from '../components/ContentEditor';

const Dashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({
    hero: {
      badge: '2026 Award Winner',
      title: 'Built with precision & integrity',
      description: 'From concept to completion — we deliver commercial, residential, and industrial projects that stand the test of time.',
      stats: [
        { number: '120+', label: 'Projects Completed' },
        { number: '98%', label: 'Client Satisfaction' },
        { number: '15+', label: 'Years Experience' }
      ]
    },
    about: {
      tag: 'About Us',
      title: 'Building Excellence Since 2010',
      description: 'BuildPort is a full-service construction company dedicated to delivering superior quality, innovation, and reliability. We bring your vision to life with precision craftsmanship and sustainable practices.',
      features: [
        { title: 'Quality Assurance', description: 'Rigorous quality control at every stage' },
        { title: 'On-Time Delivery', description: 'Projects completed within schedule' },
        { title: 'Sustainable Building', description: 'Eco-friendly materials and practices' }
      ]
    },
    contact: {
      title: "Let's Build Together",
      description: 'Have a project in mind? Get in touch with our team for a free consultation and quote.',
      phone: '+1 (555) 123-4567',
      email: 'info@buildport.com',
      address: '123 Construction Ave, Suite 200'
    }
  });

  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleContentChange = (section, data) => {
    setContent(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveMessage('Content saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving content. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: 'fa-star' },
    { id: 'about', label: 'About Section', icon: 'fa-info-circle' },
    { id: 'services', label: 'Services', icon: 'fa-wrench' },
    { id: 'projects', label: 'Projects', icon: 'fa-tasks' },
    { id: 'team', label: 'Team', icon: 'fa-users' },
    { id: 'contact', label: 'Contact', icon: 'fa-envelope' }
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar 
        sections={sections} 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={onLogout}
      />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>
            <i className={`fas ${sections.find(s => s.id === activeSection)?.icon}`}></i>
            Edit {sections.find(s => s.id === activeSection)?.label}
          </h2>
          <div className="header-actions">
            {saveMessage && (
              <span className={`save-message ${saveMessage.includes('success') ? 'success' : 'error'}`}>
                {saveMessage}
              </span>
            )}
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <div className="editor-container">
          <ContentEditor 
            section={activeSection}
            content={content[activeSection]}
            onContentChange={(data) => handleContentChange(activeSection, data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;