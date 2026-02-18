// api/notificationApi.js
import api from '../http/axiosClient.js';

const NOTIFICATIONS_URL = '/notifications';

export const getUserNotifications = async () => {
  try {
    const { data } = await api.get(NOTIFICATIONS_URL);
    return data;
  } catch (err) {
    // Return empty data if API fails
    return { notifications: [], unreadCount: 0 };
  }
};

export const markNotificationsAsRead = async () => {
  const { data } = await api.patch(`${NOTIFICATIONS_URL}/read-all`); // ✅ PATCH with template literal
  return data;
};