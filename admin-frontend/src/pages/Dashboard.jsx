// admin-frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ContentEditor from '../components/ContentEditor';
import { fetchContent, saveContent } from '../api/contentApi';
import { GoArrowLeft, GoCheck, GoX, GoSync } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";

const Dashboard = ({ onLogout, onBack }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getDefaultContent = (section) => {
    const defaults = {
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
        description: 'BuildPort is a full-service construction company dedicated to delivering superior quality, innovation, and reliability.',
        features: [
          { title: 'Quality Assurance', description: 'Rigorous quality control at every stage' },
          { title: 'On-Time Delivery', description: 'Projects completed within schedule' },
          { title: 'Sustainable Building', description: 'Eco-friendly materials and practices' }
        ]
      },
      services: {
        title: 'Our Services',
        subtitle: 'Comprehensive construction solutions tailored to your project needs',
        services: [
          { icon: 'fa-hard-hat', title: 'General Contracting', description: 'Full-service construction management from ground-up to completion.' },
          { icon: 'fa-pencil-ruler', title: 'Design & Build', description: 'Integrated design and construction services for seamless delivery.' },
          { icon: 'fa-house-chimney', title: 'Residential Construction', description: 'Custom homes, renovations, and residential development projects.' }
        ]
      },
      team: {
        title: 'Our Team',
        subtitle: 'Meet the experts behind our award-winning projects',
        members: [
          { name: 'David Martinez', role: 'CEO & Founder', experience: '25+ years' },
          { name: 'Sarah Johnson', role: 'Project Director', experience: '18 years' },
          { name: 'Michael Chen', role: 'Lead Architect', experience: '15 years' }
        ]
      },
      projects: {
        title: 'Featured Projects',
        subtitle: 'Explore our portfolio of exceptional construction projects',
        projects: [
          { title: 'Riverside Tower', location: 'Austin, TX', category: 'Commercial', tags: ['High-rise', 'LEED Certified'] },
          { title: 'Willow Creek Estate', location: 'Napa Valley, CA', category: 'Residential', tags: ['Luxury', 'Eco-Friendly'] }
        ]
      },
      contact: {
        title: "Let's Build Together",
        description: 'Have a project in mind? Get in touch with our team for a free consultation and quote.',
        phone: '+1 (555) 123-4567',
        email: 'info@buildport.com',
        address: '123 Construction Ave, Suite 200'
      }
    };
    return defaults[section] || {};
  };

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const data = await fetchContent(activeSection);
        setContent(prev => ({
          ...prev,
          [activeSection]: data
        }));
      } catch (error) {
        console.error('Error loading content:', error);
        setContent(prev => ({
          ...prev,
          [activeSection]: getDefaultContent(activeSection)
        }));
        setSaveMessage('⚠️ Using default content - API connection issue');
        setTimeout(() => setSaveMessage(''), 4000);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, [activeSection]);

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
      await saveContent(activeSection, content[activeSection]);
      setSaveMessage('✅ Content saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('❌ Error saving content. Please try again.');
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

  const currentSection = sections.find(s => s.id === activeSection);

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
          <div className="header-left">
            <button className="back-btn" onClick={onBack}>
              <GoArrowLeft size={18} />
              Back to Dashboard
            </button>
            <h2>
              <i className={`fas ${currentSection?.icon}`}></i>
              Edit {currentSection?.label}
            </h2>
          </div>
          <div className="header-actions">
            {saveMessage && (
              <span className={`save-message ${saveMessage.includes('✅') ? 'success' : 'error'}`}>
                {saveMessage}
              </span>
            )}
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={loading || isLoading}
            >
              {loading ? (
                <>
                  <GoSync className="spinning" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <FaRegSave size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <div className="editor-container">
          {isLoading ? (
            <div className="loading-spinner">
              <GoSync className="spinning" size={32} />
              Loading content...
            </div>
          ) : (
            <ContentEditor 
              section={activeSection}
              content={content[activeSection] || {}}
              onContentChange={(data) => handleContentChange(activeSection, data)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;