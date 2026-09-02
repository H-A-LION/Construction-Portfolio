// frontend/src/components/Services.jsx
import React, { useEffect, useState } from 'react';
import HorizontalScroll from './HorizontalScroll';
import { fetchServices } from '../api/contentApi';
import servicesImage from '../images/services.jpg'; // Fallback

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  if (loading) {
    return <div className="services-loading">Loading services...</div>;
  }

  const sectionStyle = {
    backgroundImage: `url(${servicesImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative'
  };

  return (
    <section className="services" style={sectionStyle}>
      <div className="services-overlay"></div>
      <div className="services-content">
        <h2 className="section-title">
          Our <span>Services</span>
        </h2>
        <p className="section-subtitle">
          Comprehensive construction solutions tailored to your project needs
        </p>
        
        <HorizontalScroll 
          speed={3000} 
          cardWidth={300}
          gap={24}
        >
          {services.map((service) => (
            <div key={service.id || service.title} className="service-card">
              <div className="service-icon">
                <i className={`fas ${service.icon || 'fa-tools'}`}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <button className="service-link">
                Learn More <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          ))}
        </HorizontalScroll>
      </div>
    </section>
  );
};

export default Services;