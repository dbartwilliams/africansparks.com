import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllSparks, 
  createSpark, 
  getSpark, 
  deleteSpark, 
  toggleLike,
  toggleRespark,
  getConnectingSparks 
} from '../api/sparkApi.js';

// Queries
export const useShowAllSparks = () => {
  return useQuery({
    queryKey: ['sparks'],
    queryFn: getAllSparks,
  });
};

export const useShowConnectingSparks = () => {
  return useQuery({
    queryKey: ['connectingSparks'],
    queryFn: getConnectingSparks,
    staleTime: 1000 * 60, // 1 min cache
  });
};

export const useShowOneSpark = (id) => {
  return useQuery({
    queryKey: ['sparks', id],
    queryFn: () => getSpark(id),
    enabled: !!id,
  });
};

// Mutations
export const useCreateSpark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSpark,
    onSuccess: (newSpark) => {
      queryClient.setQueryData(['sparks'], (old = []) => [newSpark, ...old]);
    },
  });
};

export const useDeleteSpark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSpark,
    onSuccess: () => {
      queryClient.invalidateQueries(['sparks']);
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLike,
    onSuccess: (data, sparkId) => {
      console.log('Mutation success - data:', data);
      console.log('sparkId:', sparkId);

      queryClient.setQueryData(['sparks'], (oldSparks) => {
        console.log('Old sparks:', oldSparks);
        if (!oldSparks) return oldSparks;
        
        return oldSparks.map(spark => {
          if (spark._id === sparkId) {
            console.log('Updating spark:', spark._id, 'with:', data); // ✅ Inside map callback
            return { 
              ...spark, 
              isLiked: data.liked,
              likesCount: data.likesCount 
            };
          }
          return spark;
        });
      });
    },
    onError: (error) => {
      console.error('Like mutation error:', error);
    }
  });
};

export const useToggleRespark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleRespark,
    onSuccess: (data, sparkId) => {
      queryClient.setQueryData(['sparks'], (oldSparks) => {
        if (!oldSparks) return oldSparks;
        
        return oldSparks.map(spark => 
          spark._id === sparkId 
            ? { 
                ...spark, 
                isResparked: data.resparked,
                resparksCount: data.resparksCount 
              }
            : spark
        );
      });
    },
  });
};