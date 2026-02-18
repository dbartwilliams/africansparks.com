import api from '../http/axiosClient.js';

const COMMENTS_URL = '/comments';

// Get all comments
export const getAllComments = async () => {
  const { data } = await api.get(COMMENTS_URL);
  return data;
};


// Get comments BY sparkid
export const getCommentsBySparkId = async (sparkId) => {
  const response = await api.get(`${COMMENTS_URL}/${sparkId}/comments`);
  return response.data;
};


// Create comment
export const createComment = async ({ sparkId, content }) => {
  const { data } = await api.post('/comments', {
    sparkId,
    content,
  });
  return data; // Should return populated comment
};

// Delete comment
export const deleteComment = async (commentId) => {
  const { data } = await api.delete(`${COMMENTS_URL}/${commentId}`);
  return data;
};
