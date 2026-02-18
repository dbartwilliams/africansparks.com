import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllComments,
  createComment,
  deleteComment,
  getCommentsBySparkId
} from '../api/commentApi';

// =======================
// Queries
// =======================
export const useShowAllComments = () =>
  useQuery({
    queryKey: ['comments'],
    queryFn: getAllComments,
  });


export const useShowSparkComments = (sparkId) => {
    return useQuery({
      queryKey: ["sparkComments", sparkId],
      queryFn: () => getCommentsBySparkId(sparkId),
      enabled: !!sparkId,
    });
  };

// =======================
// Mutations
// =======================
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment, variables) => {
      // Add to comments
      queryClient.setQueryData(['comments'], (old = []) => [
        newComment,
        ...old,
      ]);
      
      // ✅ Directly update spark's comment count
      queryClient.setQueryData(['sparks'], (oldSparks) => {
        if (!oldSparks) return oldSparks;
        
        return oldSparks.map(spark => 
          spark._id === variables.sparkId 
            ? { 
                ...spark, 
                commentsCount: (spark.commentsCount || 0) + 1 
              }
            : spark
        );
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
