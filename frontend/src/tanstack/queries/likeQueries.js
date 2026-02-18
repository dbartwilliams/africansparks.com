// tanstack/queries/likeQueries.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike } from '../api/likeApi';

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLike,
    onSuccess: (data, sparkId) => {
      // Update specific spark in cache
      queryClient.setQueryData(['sparks'], (oldSparks) => {
        if (!oldSparks) return oldSparks;
        
        return oldSparks.map(spark => 
          spark._id === sparkId 
            ? { 
                ...spark, 
                isLiked: data.liked,
                likesCount: data.likesCount 
              }
            : spark
        );
      });

      // Also update single spark cache if exists
      queryClient.setQueryData(['spark', sparkId], (old) => {
        if (!old) return old;
        return { 
          ...old, 
          isLiked: data.liked,
          likesCount: data.likesCount 
        };
      });
    },
  });
};