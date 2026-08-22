import React from 'react';

const Pages = () => {
  const pages = [
    {
      title: 'Project Gallery',
      description: 'View our complete portfolio of construction projects',
      icon: 'fa-images'
    },
    {
      title: 'Blog & Insights',
      description: 'Industry news, tips, and construction insights',
      icon: 'fa-newspaper'
    },
    {
      title: 'Careers',
      description: 'Join our team of construction professionals',
      icon: 'fa-briefcase'
    },
    {
      title: 'Resources',
      description: 'Guides, tools, and resources for your projects',
      icon: 'fa-book-open'
    }
  ];

  return (
    <section className="pages">
      <h2 className="section-title">
        Explore <span>Pages</span>
      </h2>
      <p className="section-subtitle">
        Discover more resources and information about our work
      </p>
      <div className="pages-grid">
        {pages.map((page, index) => (
          <div key={index} className="page-card">
            <div className="page-icon">
              <i className={`fas ${page.icon}`}></i>
            </div>
            <h3>{page.title}</h3>
            <p>{page.description}</p>
            <button className="page-link">
              Explore <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pages;