const API_BASE_URL = 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Something went wrong'
    );
  }

  return data;
};

const API = {
  auth: {
    register: (payload) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),

    login: (payload) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),

    me: () =>
      request('/auth/me'),

    logout: () =>
      request('/auth/logout', {
        method: 'POST'
      })
  }
};

export default API;