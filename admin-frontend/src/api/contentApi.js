// admin-frontend/src/api/contentApi.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const fetchContent = async (section) => {
  try {
    const response = await fetch(`${API_URL}/content/${section}`, {
      headers: headers()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const saveContent = async (section, data) => {
  try {
    const response = await fetch(`${API_URL}/content/${section}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ data })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save content');
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error saving content:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    const result = await response.json();
    if (result.data.token) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }
    return result.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};