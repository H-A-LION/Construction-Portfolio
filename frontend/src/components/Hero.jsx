import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-trophy"></i>
            <span>2026 Award Winner</span>
          </div>
          <h1>
            Built with <span>precision</span> <br />
            &amp; integrity
          </h1>
          <p>
            From concept to completion — we deliver commercial, residential, 
            and industrial projects that stand the test of time.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">
              <i className="fas fa-arrow-right"></i> View Portfolio
            </button>
            <button className="btn-secondary">
              <i className="fas fa-calendar-alt"></i> Free Consultation
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">120+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
            <div className="stat">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-placeholder">
            <i className="fas fa-drafting-compass"></i>
            <p>Construction · Engineering</p>
            <small>Building the future, today</small>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;