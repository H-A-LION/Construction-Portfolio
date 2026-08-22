import React, { useState } from 'react';

const Navbar = ({ scrollToSection, sectionRefs }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', key: 'home' },
    { name: 'About', key: 'about' },
    { name: 'Services', key: 'services' },
    { name: 'Projects', key: 'projects' },
    { name: 'Team', key: 'team' },
    { name: 'Pages', key: 'pages' },
    { name: 'Contact', key: 'contact' },
  ];

  const handleNavClick = (key) => {
    if (sectionRefs[key]) {
      scrollToSection(sectionRefs[key]);
      setIsMenuOpen(false);
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
                className="nav-link" 
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