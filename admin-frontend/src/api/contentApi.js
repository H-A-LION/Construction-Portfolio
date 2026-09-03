// admin-frontend/src/api/contentApi.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const getToken = () => localStorage.getItem('token');

const headers = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const fetchContent = async (section) => {
  try {
    const response = await fetch(`${API_URL}/content/${section}`, {
      headers: headers()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }
    
    const result = await response.json();
    const data = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
    return data;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const fetchAllContent = async () => {
  try {
    const response = await fetch(`${API_URL}/content/all`, {
      headers: headers()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch all content');
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching all content:', error);
    throw error;
  }
};

export const saveContent = async (section, data) => {
  try {
    // Create a clean copy of data without image files
    const cleanData = { ...data };
    
    const response = await fetch(`${API_URL}/content/${section}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ data: cleanData })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save content');
    }
    
    const result = await response.json();
    const responseData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
    return responseData;
  } catch (error) {
    console.error('Error saving content:', error);
    throw error;
  }
};

// admin-frontend/src/api/contentApi.js - Updated upload function
export const uploadImage = async (section, file, field = 'hero_image') => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('field', field);
    formData.append('original_name', file.name); // Send original filename
    
    const response = await fetch(`${API_URL}/content/${section}/upload-image`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (section, field = 'hero_image') => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/content/${section}/delete-image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ field })
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error deleting image:', error);
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
    
    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse login response:', parseError);
      throw new Error('Invalid response from server. Please check if the backend is running.');
    }
    
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Invalid credentials');
    }
    
    if (result.success && result.data) {
      const token = result.data.token;
      const user = result.data.user;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return result.data;
      } else {
        throw new Error('No token received from server');
      }
    } else {
      throw new Error('Invalid response structure from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};