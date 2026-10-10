const API_BASE_URL = 'https://silent-sos-api-cp9r.onrender.com/api';

const getToken = () => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getToken();

  if (!token) {
    throw new Error(
      'Your session has expired. Please sign in again.'
    );
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

const getProfile = async () => {
  const response = await fetch(
    `${API_BASE_URL}/users/profile`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to retrieve your profile.'
    );
  }

  return result;
};

const updateProfile = async (profileData) => {
  const response = await fetch(
    `${API_BASE_URL}/users/profile`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to update your profile.'
    );
  }

  return result;
};

const updateSettings = async (settingsData) => {
  const response = await fetch(
    `${API_BASE_URL}/users/settings`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(settingsData)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to update your safety settings.'
    );
  }

  return result;
};

export {
  getProfile,
  updateProfile,
  updateSettings
};