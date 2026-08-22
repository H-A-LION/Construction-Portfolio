// src/App.js
import React, { useState, useRef } from 'react';
import './index.scss';

// Import main components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Team from './components/Team';
import Pages from './components/Pages';
import Contact from './components/Contact';

// Import admin components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const projectsRef = useRef(null);
  const teamRef = useRef(null);
  const pagesRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sectionRefs = {
    home: homeRef,
    about: aboutRef,
    services: servicesRef,
    projects: projectsRef,
    team: teamRef,
    pages: pagesRef,
    contact: contactRef,
  };

  const handleLogin = () => {
    setIsAdmin(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowAdmin(false);
  };

  // Toggle admin panel with keyboard shortcut (Ctrl+Shift+A)
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (isAdmin) {
          setShowAdmin(!showAdmin);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isAdmin, showAdmin]);

  if (showAdmin && isAdmin) {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (isAdmin) {
    return (
      <div className="App">
        <div className="admin-toggle">
          <button 
            className="admin-toggle-btn"
            onClick={() => setShowAdmin(true)}
          >
            <i className="fas fa-cog"></i>
            Admin Panel
          </button>
        </div>
        <Navbar scrollToSection={scrollToSection} sectionRefs={sectionRefs} />
        <section ref={homeRef} id="home"><Hero /></section>
        <section ref={aboutRef} id="about"><About /></section>
        <section ref={servicesRef} id="services"><Services /></section>
        <section ref={projectsRef} id="projects"><Projects /></section>
        <section ref={teamRef} id="team"><Team /></section>
        <section ref={pagesRef} id="pages"><Pages /></section>
        <section ref={contactRef} id="contact"><Contact /></section>
      </div>
    );
  }

  return <Login onLogin={handleLogin} />;
}

export default App;