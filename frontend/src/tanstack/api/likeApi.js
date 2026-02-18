// api/likeApi.js
import api from '../http/axiosClient.js';

// const LIKE_URL = '/sparks';

export const toggleLike = async (sparkId) => {
  const response = await api.post(`/sparks/${sparkId}/like`);
  return response.data; // { liked: boolean, likesCount: number }
};


