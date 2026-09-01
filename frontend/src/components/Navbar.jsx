// Navbar.jsx - Updated
import React, { useState, useEffect } from 'react';

const Navbar = ({ scrollToSection, sectionRefs }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { name: 'Home', key: 'home' },
    { name: 'About', key: 'about' },
    { name: 'Services', key: 'services' },
    { name: 'Projects', key: 'projects' },
    { name: 'Team', key: 'team' },
    { name: 'Pages', key: 'pages' },
    { name: 'Contact', key: 'contact' },
  ];

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Offset for navbar height

      // Find which section is currently in view
      for (const [key, ref] of Object.entries(sectionRefs)) {
        if (ref && ref.current) {
          const element = ref.current;
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(key);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRefs]);

  const handleNavClick = (key) => {
    if (sectionRefs[key]) {
      scrollToSection(sectionRefs[key]);
      setIsMenuOpen(false);
      setActiveSection(key);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <i className="fas fa-hard-hat"></i>
          <span>Constructify</span>
        </div>

        <button 
          className="navbar-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.key}>
              <button 
                className={`nav-link ${activeSection === item.key ? 'active' : ''}`} 
                onClick={() => handleNavClick(item.key)}
              >
                {item.name}
              </button>
            </li>
          ))}
          <li className="nav-cta">
            <button className="btn-primary" onClick={() => handleNavClick('contact')}>
              <i className="fas fa-phone-alt"></i> Get Estimate
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;