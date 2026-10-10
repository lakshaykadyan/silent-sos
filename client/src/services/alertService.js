const API_BASE_URL =
  'https://silent-sos-api-cp9r.onrender.com/api';

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

const parseResponse = async (response, fallbackMessage) => {
  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      'The server returned an invalid response. Please try again.'
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message || fallbackMessage
    );
  }

  return result;
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

  return parseResponse(
    response,
    'Unable to create emergency alert.'
  );
};

const getActiveAlert = async () => {
  const response = await fetch(
    `${API_BASE_URL}/alerts/active`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  return parseResponse(
    response,
    'Unable to retrieve active alert.'
  );
};

const getAlertHistory = async () => {
  const response = await fetch(
    `${API_BASE_URL}/alerts/history`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  return parseResponse(
    response,
    'Unable to retrieve alert history.'
  );
};

const getAlertById = async (alertId) => {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${alertId}`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  return parseResponse(
    response,
    'Unable to retrieve alert details.'
  );
};

const getAlertLocationHistory = async (alertId) => {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${alertId}/location`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  return parseResponse(
    response,
    'Unable to retrieve location history.'
  );
};

const updateAlertLocation = async (alertId, location) => {
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

  return parseResponse(
    response,
    'Unable to update alert location.'
  );
};

const resolveAlert = async (alertId, resolutionNote) => {
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

  return parseResponse(
    response,
    'Unable to resolve emergency alert.'
  );
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