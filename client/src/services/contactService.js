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

const getContacts = async () => {
  const response = await fetch(
    `${API_BASE_URL}/contacts`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to retrieve emergency contacts.'
    );
  }

  return result;
};

const createContact = async (contactData) => {
  const response = await fetch(
    `${API_BASE_URL}/contacts`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(contactData)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to add emergency contact.'
    );
  }

  return result;
};

const updateContact = async (
  contactId,
  contactData
) => {
  const response = await fetch(
    `${API_BASE_URL}/contacts/${contactId}`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(contactData)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to update emergency contact.'
    );
  }

  return result;
};

const deleteContact = async (contactId) => {
  const response = await fetch(
    `${API_BASE_URL}/contacts/${contactId}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      'Unable to delete emergency contact.'
    );
  }

  return result;
};

export {
  getContacts,
  createContact,
  updateContact,
  deleteContact
};