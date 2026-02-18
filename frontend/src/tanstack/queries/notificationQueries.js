// hooks/useShowNotifications.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserNotifications, markNotificationsAsRead } from '../api/notificationApi.js';

export const useShowNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getUserNotifications,
    // Don't select - keep full data structure identical
  });
};

export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationsAsRead, // ✅ Correct function name
    onSuccess: () => {
      // Invalidate notifications to refresh unread count
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};