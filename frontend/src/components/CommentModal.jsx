import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCreateComment } from '../tanstack/queries/commentQueries';
import Image from '../components/Image';
import { getAvatarPath } from '../util/imageKitHelper';

const CommentModal = ({
  isOpen,
  onClose,
  spark,
  notification,
  context = "spark", // "spark" | "notification"
}) => {
  const [commentText, setCommentText] = useState('');
  const { user } = useAuthStore();
  const { mutate: createComment, isPending } = useCreateComment();

  const handleClose = () => {
    setCommentText('');
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && handleClose();

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    if (!spark?._id) return;

    createComment(
      {
        sparkId: spark._id,
        content: commentText.trim(),
      },
      {
        onSuccess: () => {
          setCommentText('');
          handleClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  // =========================
  // 🔥 Determine preview data
  // =========================

  let avatar;
  let name;
  let handle;
  let content;
  let createdAt;

  if (context === "notification" && notification) {
    avatar = getAvatarPath(notification.actor?.userAvatar);
    name = notification.actor?.userName;
    handle = notification.actor?.handle;
    content = notification.comment?.content;
    createdAt = notification.comment?.createdAt || notification.createdAt;
  } else if (spark) {
    avatar = getAvatarPath(spark.userAvatar);
    name = spark.name;
    handle = spark.handle;
    content = spark.content;
    createdAt = spark.createdAt;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:items-center sm:pt-0">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-blue-900/20 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-xl bg-[#15202b] border border-gray-800 shadow-2xl sm:rounded-2xl">
        
        {/* Header */}
        <div className="flex items-center h-12 px-4 border-b border-gray-800">
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-900"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">

          {/* ================= PREVIEW ================= */}
          {content && (
            <div className="flex gap-3 mb-4">
              
              <div className="flex flex-col items-center">
                <Image
                  src={avatar}
                  className="w-10 h-10 rounded-full"
                  alt={name}
                />
                <div className="w-0.5 h-full bg-gray-800 my-2" />
              </div>

              <div className="flex-1">
                
                <div className="flex gap-2 text-[15px]">
                  <span className="font-bold">{name}</span>
                  {handle && (
                    <span className="text-gray-500">{handle}</span>
                  )}
                  {createdAt && (
                    <span className="text-gray-500">
                      · {new Date(createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-gray-200">{content}</p>

                <p className="mt-3 text-[13px] text-gray-500">
                  {context === "notification"
                    ? "Replying to this comment"
                    : `Commenting to ${handle}`}
                </p>
              </div>
            </div>
          )}
          {/* ========================================== */}

          {/* Comment Input */}
          <div className="flex gap-3">
            
            <Image
              src={getAvatarPath(user?.userAvatar)}
              className="w-10 h-10 rounded-full"
              alt={user?.userName}
            />

            <div className="flex-1">
              
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  context === "notification"
                    ? "Write your reply"
                    : "Post your comment"
                }
                className="w-full bg-transparent text-xl text-white placeholder-gray-500 outline-none resize-none min-h-[120px]"
                autoFocus
              />

              <div className="my-3 border-t border-gray-800" />

              <div className="flex items-center justify-between">
                
                <div className="flex gap-2 text-blue-500">
                  <button className="p-2 rounded-full hover:bg-blue-500/10">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!commentText.trim() || isPending}
                  className={`px-5 py-2 rounded-xl font-bold ${
                    commentText.trim()
                      ? 'buttoncol hover:opacity-90'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isPending ? 'Posting…' : 'Comment'}
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommentModal;
