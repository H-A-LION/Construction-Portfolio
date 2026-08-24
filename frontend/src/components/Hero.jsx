import React,{useEffect,useState} from 'react';
import { fetchHeroContent } from '../api/contentApi';

const Hero = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      const data = await fetchHeroContent();
      setContent(data);
      setLoading(false);
    };
    loadContent();
  }, []);

  if (loading) {
    return <div className="hero-loading">Loading...</div>;
  }
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-trophy"></i>
            <span>{content.badge}</span>
          </div>
          <h1 dangerouslySetInnerHTML={{ __html: content.title }} />
          <p>{content.description}</p>
          <div className="hero-actions">
            <button className="btn-primary">
              <i className="fas fa-arrow-right"></i> View Portfolio
            </button>
            <button className="btn-secondary">
              <i className="fas fa-calendar-alt"></i> Free Consultation
            </button>
          </div>
          <div className="hero-stats">
            {content.stats.map((stat, index) => (
            <div key={index} className="stat">
              <span className="stat-number">{stat.number}+</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            ))}
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