import React from 'react';
import aboutImage1 from '../images/about-1.jpg';
import aboutImage2 from '../images/about-2.jpg';

const About = () => {
  return (
    <section className="about">
      <div className="about-container">
        <div className="about-image">
          <div className="about-image-wrapper">
            <div className="about-image-main">
              <img 
                src={aboutImage1}
                alt="Construction site" 
              />
            </div>
            <div className="about-image-overlay">
              <img 
                src={aboutImage2}
                alt="Architecture design" 
              />
            </div>
          </div>
        </div>
        <div className="about-content">
          <span className="about-tag">About Us</span>
          <h2>Building Excellence <span>Since 2010</span></h2>
          <p>
            BuildPort is a full-service construction company dedicated to delivering 
            superior quality, innovation, and reliability. We bring your vision to 
            life with precision craftsmanship and sustainable practices.
          </p>
          <div className="about-features">
            <div className="feature">
              <i className="fas fa-check-circle"></i>
              <div>
                <h4>Quality Assurance</h4>
                <p>Rigorous quality control at every stage</p>
              </div>
            </div>
            <div className="feature">
              <i className="fas fa-clock"></i>
              <div>
                <h4>On-Time Delivery</h4>
                <p>Projects completed within schedule</p>
              </div>
            </div>
            <div className="feature">
              <i className="fas fa-leaf"></i>
              <div>
                <h4>Sustainable Building</h4>
                <p>Eco-friendly materials and practices</p>
              </div>
            </div>
          </div>
          <button className="btn-primary">
            Learn More <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;