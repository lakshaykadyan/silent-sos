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

const getNotifications = async () => {
  const response = await fetch(
    `${API_BASE_URL}/notifications`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to retrieve notifications.'
    );
  }

  return result;
};

const getUnreadNotifications = async () => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/unread`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to retrieve unread notifications.'
    );
  }

  return result;
};

const markNotificationAsRead = async (
  notificationId
) => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: 'PATCH',
      headers: getAuthHeaders()
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to mark notification as read.'
    );
  }

  return result;
};

const markAllNotificationsAsRead = async () => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/read-all`,
    {
      method: 'PATCH',
      headers: getAuthHeaders()
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to mark notifications as read.'
    );
  }

  return result;
};

export {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};