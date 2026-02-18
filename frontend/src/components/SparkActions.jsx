import React from 'react';
import { MessageCircle, Repeat2, Heart, Share } from 'lucide-react';
import { useAuthStore } from "../store/authStore";
import { useToggleLike, useToggleRespark } from "../tanstack/queries/sparkQueries";

const SparkActions = ({ spark, onCommentClick }) => {
  const { user } = useAuthStore();

  const { mutate: toggleLike, isPending: isLikeLoading } = useToggleLike();
  const { mutate: toggleRespark, isPending: isResparkLoading } = useToggleRespark();



  // Get current state from spark data
  const isLiked = spark.isLiked || false;
  const isResparked = spark.isResparked || false;
  const likesCount = spark.likesCount || 0;
  const resparksCount = spark.resparksCount || 0;
  const commentsCount = spark.commentsCount || 0;
  const hasComments = (spark.commentsCount || 0) > 0;

  console.log('SparkActions:', { id: spark._id, isLiked, likesCount });

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const isOwnSpark = spark.authorId === user?._id; // ✅ Use authorId (flattened in backend)

  const notifyAuthor = (type) => {
    if (isOwnSpark) return;

    const notification = {
      id: Date.now(),
      type,
      sparkId: spark._id,
      actor: {
        id: user?._id,
        name: user?.userName,
        handle: user?.userName,
        avatar: user?.userAvatar,
      },
      recipientId: spark.authorId, // ✅ Use authorId
      read: false,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify([notification, ...existing]));
    window.dispatchEvent(new Event('newNotification'));
  };

  // Like handler
  const handleLike = () => {
    toggleLike(spark._id, {
      onSuccess: (data) => {
        if (data.liked) {
          notifyAuthor('like');
        }
      },
    });
  };

  // ✅ Respark handler - now uses mutation
  const handleRespark = (e) => {
    e.stopPropagation();
    console.log('🔥 Respark clicked:', spark._id, 'Current isResparked:', isResparked);
   
   
    toggleRespark(spark._id, {
      onSuccess: (data) => {
        console.log('✅ Respark success:', data);
        if (data.resparked) {
          notifyAuthor('respark');
        }
      },
    });
  };

  const handleComment = () => {
    onCommentClick();
    notifyAuthor('comment');
  };

  // ... rest of JSX (handlers, return statement with buttons)
  return (
    <div className="flex justify-between max-w-md mt-3 text-gray-500">
      {/* Comments */}
      <div
        className={`flex items-center gap-2 transition-colors cursor-pointer group ${
          hasComments ? 'text-blue-500' : 'hover:text-blue-500'
        }`}
        onClick={handleComment}
      >
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          hasComments ? 'bg-blue-500/10' : 'group-hover:bg-blue-500/10'
        }`}>
          <MessageCircle className={`w-4 h-4 ${hasComments && 'fill-current'}`} />
        </div>
        <span className="text-xs">{formatNumber(spark.commentsCount || 0)}</span>
      </div>


      {/* Resparks */}
      <div 
        className={`flex items-center gap-2 transition-colors cursor-pointer group ${
          isResparked ? 'text-green-500' : 'hover:text-green-500'
        }`}
        onClick={handleRespark}
      >
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          isResparked ? 'bg-green-500/10' : 'group-hover:bg-green-500/10'
        }`}>
          {isResparkLoading ? (
            <div className="w-4 h-4 border-2 border-green-500 rounded-full border-t-transparent animate-spin" />
          ) : (
            <Repeat2 className={`w-4 h-4 ${isResparked && 'fill-current'}`} />
          )}
        </div>
        <span className="text-xs">{formatNumber(resparksCount)}</span>
      </div>

      {/* Likes */}
      <div 
        className={`flex items-center gap-2 transition-colors cursor-pointer group ${
          isLiked ? 'text-pink-600' : 'hover:text-pink-600'
        }`}
        onClick={handleLike}
      >
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          isLiked ? 'bg-pink-600/10' : 'group-hover:bg-pink-600/10'
        }`}>
          {isLikeLoading ? (
            <div className="w-4 h-4 border-2 border-pink-600 rounded-full border-t-transparent animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 ${isLiked && 'fill-current'}`} />
          )}
        </div>
        <span className="text-xs">{formatNumber(likesCount)}</span>
      </div>

      {/* Share */}
      <div className="flex items-center gap-2 transition-colors cursor-pointer group hover:text-blue-500">
        <div className="flex items-center justify-center w-8 h-8 rounded-full group-hover:bg-blue-500/10">
          <Share className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default SparkActions;

