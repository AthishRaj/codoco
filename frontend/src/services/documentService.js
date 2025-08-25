import axios from 'axios';

const API_URL = 'http://localhost:5000/api/documents';

// Get token each time
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.token : null;
  return { Authorization: `Bearer ${token}` };
};

export const getDocuments = async () => {
  const { data } = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return data;
};

export const getDocumentById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return data;
};

export const updateDocument = async (id, documentData) => {
  const { data } = await axios.put(`${API_URL}/${id}`, documentData, {
    headers: getAuthHeader(),
  });
  return data;
};

export const deleteDocument = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return data;
};
