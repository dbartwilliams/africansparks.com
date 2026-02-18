import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserById, toggleConnect, getLatestUsers, updateUserProfile, getUserSparks } from '../api/usersApi.js';

export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],        // unique key for this user
    queryFn: () => getUserById(id) // fetch function
  });
};

// RightSidebar used
export const useLatestUsers = (limit = 2) => {
  return useQuery({
    queryKey: ['users', 'latest', limit],
    queryFn: () => getLatestUsers(limit),
  });
};

// Connect aka: Follow
export const useToggleConnect = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleConnect(userId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['users', 'latest']);
      
      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(['users', 'latest']);
      
      // Optimistically update
      queryClient.setQueryData(['users', 'latest'], (old) => {
        if (!old) return old;
        return old.map(user => {
          if (user._id === userId) {
            const isConnected = user.connections?.some(c => c._id === userId);
            return {
              ...user,
              connections: isConnected
                ? user.connections.filter(c => c._id !== userId)
                : [...user.connections, { _id: userId }]
            };
          }
          return user;
        });
      });
      
      return { previousUsers };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['users', 'latest'], context.previousUsers);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['users', 'latest']);
      queryClient.invalidateQueries(['user', 'me']);
    },
  });
};

// Hook for updating user profile
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['user', data._id] });
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
};

export const useUserSparks = (userId) =>
  useQuery({
    queryKey: ["userSparks", userId],
    queryFn: () => getUserSparks(userId),
    enabled: !!userId,
  });