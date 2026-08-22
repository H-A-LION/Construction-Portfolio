import React from 'react';

const Projects = () => {
  const projects = [
    {
      title: 'Riverside Tower',
      location: 'Austin, TX',
      category: 'Commercial',
      tags: ['High-rise', 'LEED Certified']
    },
    {
      title: 'Willow Creek Estate',
      location: 'Napa Valley, CA',
      category: 'Residential',
      tags: ['Luxury', 'Eco-Friendly']
    },
    {
      title: 'Harbor Industrial Hub',
      location: 'Savannah, GA',
      category: 'Industrial',
      tags: ['Warehouse', 'Logistics']
    },
    {
      title: 'Parkview Medical Pavilion',
      location: 'Denver, CO',
      category: 'Healthcare',
      tags: ['Institutional', 'Modern']
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
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-image-placeholder">
              <i className="fas fa-building"></i>
            </div>
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
        ))}
      </div>
    </section>
  );
};

export default Projects;