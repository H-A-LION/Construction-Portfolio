// Projects.jsx
import React from 'react';
import HorizontalScroll from './HorizontalScroll';
import pr1 from '../images/pr1.jpg';
import pr2 from '../images/pr2.jpg';
import pr3 from '../images/pr3.jpg';
import pr4 from '../images/pr4.jpg';

const Projects = () => {
  const projects = [
    {
      title: 'Riverside Tower',
      location: 'Austin, TX',
      category: 'Commercial',
      tags: ['High-rise', 'LEED Certified'],
      image: pr1
    },
    {
      title: 'Willow Creek Estate',
      location: 'Napa Valley, CA',
      category: 'Residential',
      tags: ['Luxury', 'Eco-Friendly'],
      image: pr2
    },
    {
      title: 'Harbor Industrial Hub',
      location: 'Savannah, GA',
      category: 'Industrial',
      tags: ['Warehouse', 'Logistics'],
      image: pr3
    },
    {
      title: 'Parkview Medical Pavilion',
      location: 'Denver, CO',
      category: 'Healthcare',
      tags: ['Institutional', 'Modern'],
      image: pr4
    }
  ];

  return (
    <section className="projects">
      <h2 className="section-title">
        Featured <span>Projects</span>
      </h2>
      <p className="section-subtitle">
        Explore our portfolio of exceptional construction projects
      </p>
      
      <HorizontalScroll 
  speed={3500} 
  cardWidth={350}  // Slightly smaller for better fit
  gap={90}
>
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-image-wrapper">
              <img src={project.image} alt={project.title} />
              <div className="project-overlay">
                <div className="project-info">
                  <span className="project-category">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p className="project-location">
                    <i className="fas fa-map-pin"></i> {project.location}
                  </p>
                  <div className="project-tags">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                  <button className="project-link">
                    View Project <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </HorizontalScroll>
    </section>
  );
};

export default Projects;