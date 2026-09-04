// admin-frontend/src/api/analyticsApi.js
const ANALYTICS_API_URL = process.env.REACT_APP_ANALYTICS_API_URL || 'http://localhost:8001/api/analytics';

const INTERNAL_API_KEY = process.env.REACT_APP_INTERNAL_API_KEY || '';

const headers = () => {
  return {
    'Content-Type': 'application/json',
    'X-Internal-Auth': INTERNAL_API_KEY
  };
};

export const fetchAnalyticsData = async () => {
  try {
    const [overview, trafficSources, geolocation, deviceBreakdown, uniqueVsReturning] = await Promise.all([
      fetchOverview(),
      fetchTrafficSources(),
      fetchGeolocation(),
      fetchDeviceBreakdown(),
      fetchUniqueVsReturning()
    ]);

    return {
      overview,
      trafficSources,
      geolocation,
      deviceBreakdown,
      uniqueVsReturning
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

export const fetchOverview = async () => {
  try {
    const response = await fetch(`${ANALYTICS_API_URL}/admin/overview?days=30`, {
      headers: headers()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch overview');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching overview:', error);
    return null;
  }
};

export const fetchTrafficSources = async () => {
  try {
    const response = await fetch(`${ANALYTICS_API_URL}/admin/traffic-sources?days=30`, {
      headers: headers()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch traffic sources');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching traffic sources:', error);
    return [];
  }
};

export const fetchGeolocation = async () => {
  try {
    const response = await fetch(`${ANALYTICS_API_URL}/admin/geolocation?days=30`, {
      headers: headers()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return [];
  }
};

export const fetchDeviceBreakdown = async () => {
  try {
    const response = await fetch(`${ANALYTICS_API_URL}/admin/device-breakdown?days=30`, {
      headers: headers()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch device breakdown');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching device breakdown:', error);
    return { devices: [], browsers: [], os: [] };
  }
};

export const fetchUniqueVsReturning = async () => {
  try {
    const response = await fetch(`${ANALYTICS_API_URL}/admin/unique-vs-returning?days=30`, {
      headers: headers()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch unique vs returning');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching unique vs returning:', error);
    return { unique_visitors: 0, returning_visitors: 0, new_visitors: 0, returning_percentage: 0 };
  }
};