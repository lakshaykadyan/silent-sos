const API_BASE_URL = 'http://localhost:5000/api';

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

const createAlert = async (location) => {
  const response = await fetch(
    `${API_BASE_URL}/alerts`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to create emergency alert.'
    );
  }

  return result;
};

const getActiveAlert = async () => {
  const response = await fetch(
    `${API_BASE_URL}/alerts/active`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to retrieve active alert.'
    );
  }

  return result;
};

const getAlertHistory = async () => {
  const response = await fetch(
    `${API_BASE_URL}/alerts/history`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to retrieve alert history.'
    );
  }

  return result;
};

const getAlertById = async (alertId) => {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${alertId}`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to retrieve alert details.'
    );
  }

  return result;
};

const getAlertLocationHistory = async (
  alertId
) => {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${alertId}/location`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to retrieve location history.'
    );
  }

  return result;
};

const updateAlertLocation = async (
  alertId,
  location
) => {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${alertId}/location`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to update alert location.'
    );
  }

  return result;
};

const resolveAlert = async (
  alertId,
  resolutionNote
) => {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${alertId}/resolve`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        resolutionNote
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to resolve emergency alert.'
    );
  }

  return result;
};

export {
  createAlert,
  getActiveAlert,
  getAlertHistory,
  getAlertById,
  getAlertLocationHistory,
  updateAlertLocation,
  resolveAlert
};