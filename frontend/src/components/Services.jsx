import React from 'react';

const Services = () => {
  const services = [
    {
      icon: 'fa-hard-hat',
      title: 'General Contracting',
      description: 'Full-service construction management from ground-up to completion.'
    },
    {
      icon: 'fa-pencil-ruler',
      title: 'Design & Build',
      description: 'Integrated design and construction services for seamless delivery.'
    },
    {
      icon: 'fa-house-chimney',
      title: 'Residential Construction',
      description: 'Custom homes, renovations, and residential development projects.'
    },
    {
      icon: 'fa-city',
      title: 'Commercial Building',
      description: 'Office spaces, retail centers, and commercial facilities.'
    },
    {
      icon: 'fa-industry',
      title: 'Industrial Projects',
      description: 'Warehouses, manufacturing plants, and industrial facilities.'
    },
    {
      icon: 'fa-helmet-safety',
      title: 'Renovation & Restoration',
      description: 'Historic restoration, remodeling, and property renovation.'
    }
  ];

  return (
    <section className="services">
      <h2 className="section-title">
        Our <span>Services</span>
      </h2>
      <p className="section-subtitle">
        Comprehensive construction solutions tailored to your project needs
      </p>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-icon">
              <i className={`fas ${service.icon}`}></i>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <button className="service-link">
              Learn More <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;