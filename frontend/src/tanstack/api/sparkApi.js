
import api from '../http/axiosClient.js';

const SPARKS_URL = '/sparks';

export const getAllSparks = async () => {
  const { data } = await api.get(SPARKS_URL);
  return data;
};

// ConnectingFeed
export const getConnectingSparks = async () => {
  const { data } = await api.get(`${SPARKS_URL}/connecting`);
  return data;
};

export const getSpark = async (id) => {
  const { data } = await api.get(`${SPARKS_URL}/${id}`);
  return data;
};

export const createSpark = async (formData) => {
  const { data } = await api.post(SPARKS_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteSpark = async (id) => {
  const { data } = await api.delete(`${SPARKS_URL}/${id}`);
  return data;
};


// ✅ Add these for likes and resparks
export const toggleLike = async (sparkId) => {
  const { data } = await api.post(`${SPARKS_URL}/${sparkId}/like`);
  return data; // { liked: boolean, likesCount: number }
};

export const toggleRespark = async (sparkId) => {
  const { data } = await api.post(`${SPARKS_URL}/${sparkId}/respark`);
  return data; // { resparked: boolean, resparksCount: number }
};

