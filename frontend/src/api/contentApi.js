// frontend/src/api/contentApi.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const fetchHeroContent = async () => {
  try {
    const response = await fetch(`${API_URL}/content/hero`);
    if (!response.ok) throw new Error('Failed to fetch hero content');
    const result = await response.json();
    // The data might be a string (JSON) or already parsed object
    const data = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
    return data;
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return getDefaultHeroContent();
  }
};

export const fetchAboutContent = async () => {
  try {
    const response = await fetch(`${API_URL}/content/about`);
    if (!response.ok) throw new Error('Failed to fetch about content');
    const result = await response.json();
    const data = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
    return data;
  } catch (error) {
    console.error('Error fetching about content:', error);
    return getDefaultAboutContent();
  }
};

export const fetchServicesContent = async () => {
  try {
    const response = await fetch(`${API_URL}/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return getDefaultServices();
  }
};

export const fetchProjectsContent = async () => {
  try {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    const result = await response.json();
    // Projects might have nested data structure with pagination
    const data = result.data && result.data.data ? result.data.data : result.data || [];
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return getDefaultProjects();
  }
};

export const fetchTeamContent = async () => {
  try {
    const response = await fetch(`${API_URL}/team`);
    if (!response.ok) throw new Error('Failed to fetch team');
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching team:', error);
    return getDefaultTeam();
  }
};

// Default content (fallback when API is down)
const getDefaultHeroContent = () => ({
  badge: '2026 Award Winner',
  title: 'Built with precision & integrity',
  description: 'From concept to completion — we deliver commercial, residential, and industrial projects that stand the test of time.',
  stats: [
    { number: '120+', label: 'Projects Completed' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '15+', label: 'Years Experience' }
  ]
});

const getDefaultAboutContent = () => ({
  tag: 'About Us',
  title: 'Building Excellence Since 2010',
  description: 'BuildPort is a full-service construction company dedicated to delivering superior quality, innovation, and reliability.',
  features: [
    { title: 'Quality Assurance', description: 'Rigorous quality control at every stage' },
    { title: 'On-Time Delivery', description: 'Projects completed within schedule' },
    { title: 'Sustainable Building', description: 'Eco-friendly materials and practices' }
  ]
});

const getDefaultServices = () => [
  { icon: 'fa-hard-hat', title: 'General Contracting', description: 'Full-service construction management from ground-up to completion.' },
  { icon: 'fa-pencil-ruler', title: 'Design & Build', description: 'Integrated design and construction services for seamless delivery.' },
  { icon: 'fa-house-chimney', title: 'Residential Construction', description: 'Custom homes, renovations, and residential development projects.' },
  { icon: 'fa-city', title: 'Commercial Building', description: 'Office spaces, retail centers, and commercial facilities.' },
  { icon: 'fa-industry', title: 'Industrial Projects', description: 'Warehouses, manufacturing plants, and industrial facilities.' },
  { icon: 'fa-helmet-safety', title: 'Renovation & Restoration', description: 'Historic restoration, remodeling, and property renovation.' }
];

const getDefaultProjects = () => [
  { title: 'Riverside Tower', location: 'Austin, TX', category: 'Commercial', tags: ['High-rise', 'LEED Certified'] },
  { title: 'Willow Creek Estate', location: 'Napa Valley, CA', category: 'Residential', tags: ['Luxury', 'Eco-Friendly'] },
  { title: 'Harbor Industrial Hub', location: 'Savannah, GA', category: 'Industrial', tags: ['Warehouse', 'Logistics'] },
  { title: 'Parkview Medical Pavilion', location: 'Denver, CO', category: 'Healthcare', tags: ['Institutional', 'Modern'] }
];

const getDefaultTeam = () => [
  { name: 'David Martinez', role: 'CEO & Founder', experience: '25+ years' },
  { name: 'Sarah Johnson', role: 'Project Director', experience: '18 years' },
  { name: 'Michael Chen', role: 'Lead Architect', experience: '15 years' },
  { name: 'Emily Rodriguez', role: 'Construction Manager', experience: '12 years' }
];