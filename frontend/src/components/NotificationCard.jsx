import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLocalPostOffice } from "react-icons/md";
import { 
  FaHeart,
  FaUser, 
  FaRegComment,
  FaRetweet
} from "react-icons/fa";
import Image from '../components/Image';
import SparkActions from './SparkActions';
import { getAvatarPath } from '../util/imageKitHelper';
import CommentModal from './CommentModal';

const CONFIG = {
  like: {
    icon: FaHeart,
    color: 'text-pink-600',
    text: name => `${name} liked your spark`,
  },
  respark: {
    icon: FaRetweet,
    color: 'text-green-500',
    text: name => `${name} resparked your spark`,
  },
  comment: {
    icon: FaRegComment,
    color: 'text-blue-500',
    text: name => `${name} commented on your spark`,
  },
  connect: {
    icon: FaUser,
    color: 'text-blue-500',
    text: name => `${name} connected with you`,
  },
};

const timeAgo = date =>
  new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

const NotificationCard = ({ notification }) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { actor, type, spark, comment, createdAt, read } = notification;

  // Check if unread - strict check for false
  const isUnread = read === false;

  if (!type) return null; 
  const config = CONFIG[type];
  if (!config) return null;
  const Icon = config.icon;

  const handleAvatarClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <article
        className={`flex gap-3 px-4 py-3 border-b border-gray-700 cursor-pointer relative ${
          isUnread 
            ? 'bg-gray-800 border-l border-blue-500 hover:bg-blue-900/30'  // Subtle blue hover
            : 'bg-transparent hover:bg-gray-800'  // Gray hover for read
        }`}
      >
        {/* UNREAD INDICATORS */}
        {isUnread && (
          <>
            {/* Blue dot */}
            <div className="absolute top-3 right-3">
            <span className="absolute inline-flex w-6 h-6 bg-green-500 rounded-full opacity-75 animate-ping"></span>

            <MdLocalPostOffice className="relative text-lg text-green-700 animate-bounce" />
            </div>
          </>
        )}

        {/* Icon */}
        <div className="flex flex-col items-center mt-1 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full">
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
        </div>

        {/* Avatar - Link to Profile */}
        <div onClick={handleAvatarClick} className="shrink-0">
          <Link to={`/profile/${actor?._id}`}>
            <Image
              src={getAvatarPath(actor?.userAvatar)}
              alt={actor?.userName}
              className="object-cover w-10 h-10 rounded-full hover:opacity-80"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pl-2">
          {/* Main text - Link to spark */}
          <Link to={spark?._id ? `/spark/${spark._id}` : '#'}> 
            <p className={`text-[18px] truncate ${isUnread ? 'text-gray-300' : 'text-gray-300'}`}>
              <span className="font-bold">{actor?.userName}</span>{' '}
              {config.text(actor?.userName).replace(actor?.userName, '')}
              <span className="ml-1 text-base text-gray-500">· {timeAgo(createdAt)}</span>
            </p>
          </Link>

          {/* Comment content */}
          {type === 'comment' && comment?.content && (
            <Link to={spark?._id ? `/spark/${spark._id}` : '#'}> 
              <p className="mt-1 text-[18px] text-gray-400 line-clamp-2">
                {comment.content}
              </p>
            </Link>
          )}

          {/* Spark preview */}
          {spark && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <SparkActions
                spark={spark}
                variant="notification"
                onCommentClick={() => setIsCommentModalOpen(true)}
              />
            </div>
          )}
        </div>
      </article>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        spark={notification.spark}
        context="notification"
      />
    </>
  );
};

export default NotificationCard;