import api from '../http/axiosClient.js';

const USERS_URL = '/users';

export const getUserById = async (id) => {
  const { data } = await api.get(`${USERS_URL}/${id}`);
  return data;
};

// Ger latest users for RughtSidebar
export const getLatestUsers = async (limit = 2) => {
  const { data } = await api.get(`${USERS_URL}/latest?limit=${limit}`);
  return data;
};

// Single toggle function
export const toggleConnect = async (userId) => {
  const { data } = await api.post(`${USERS_URL}/${userId}/connect`);
  return data;
};

// Update user profile with avatar
export const updateUserProfile = async (formData) => {
  const { data } = await api.patch(`${USERS_URL}/me`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const getUserSparks = async (userId) => {
  const { data } = await api.get(`${USERS_URL}/${userId}/sparks`);
  return data;
};

