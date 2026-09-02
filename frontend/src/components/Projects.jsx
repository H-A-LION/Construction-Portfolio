// frontend/src/components/Projects.jsx
import React, { useEffect, useState } from 'react';
import HorizontalScroll from './HorizontalScroll';
import { fetchProjects } from '../api/contentApi';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  if (loading) {
    return <div className="projects-loading">Loading projects...</div>;
  }

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
        cardWidth={350}
        gap={90}
      >
        {projects.map((project) => (
          <div key={project.id || project.title} className="project-card">
            <div className="project-image-wrapper">
              <img 
                src={project.image_url || '/images/default-project.jpg'} 
                alt={project.title}
                onError={(e) => {
                  e.target.src = '/images/default-project.jpg';
                }}
              />
              <div className="project-overlay">
                <div className="project-info">
                  <span className="project-category">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p className="project-location">
                    <i className="fas fa-map-pin"></i> {project.location}
                  </p>
                  <div className="project-tags">
                    {project.tags?.map((tag, idx) => (
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