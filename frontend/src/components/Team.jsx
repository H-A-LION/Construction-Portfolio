import React from 'react';

const Team = () => {
  const team = [
    {
      name: 'David Martinez',
      role: 'CEO & Founder',
      experience: '25+ years'
    },
    {
      name: 'Sarah Johnson',
      role: 'Project Director',
      experience: '18 years'
    },
    {
      name: 'Michael Chen',
      role: 'Lead Architect',
      experience: '15 years'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Construction Manager',
      experience: '12 years'
    }
  ];

  return (
    <section className="team">
      <h2 className="section-title">
        Our <span>Team</span>
      </h2>
      <p className="section-subtitle">
        Meet the experts behind our award-winning projects
      </p>
      <div className="team-grid">
        {team.map((member, index) => (
          <div key={index} className="team-card">
            <div className="team-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <h3>{member.name}</h3>
            <p className="team-role">{member.role}</p>
            <p className="team-experience">
              <i className="fas fa-briefcase"></i> {member.experience}
            </p>
            <div className="team-social">
              <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-link"><i className="fab fa-github"></i></a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;