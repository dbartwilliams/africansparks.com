
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Repeat2, MessageCircle } from 'lucide-react';
import Image from './Image';
import { getAvatarPath } from '../util/imageKitHelper';

// Verdict configuration
const VERDICT_CONFIG = {
  like: {
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-600/10',
    getText: (name) => `${name} liked your spark`,
  },
  respark: {
    icon: Repeat2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    getText: (name) => `${name} resparked your spark`,
  },
};

const CommentCard = ({ verdict }) => {
  const navigate = useNavigate();
  const { actor, type, spark, content, createdAt } = verdict;

  const config = VERDICT_CONFIG[type];
  const Icon = config.icon;

  const handleClick = () => {
    navigate(`/spark/${spark._id}`);
  };

  return (
    <article 
      onClick={handleClick}
      className="relative flex px-4 py-3 transition-colors border-b border-gray-700 cursor-pointer hover:bg-gray-900/50 bg-slate-850"
    >
      {/* Icon column - left of avatar */}
      <div className="flex flex-col items-center mr-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${config.bgColor}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        {/* Vertical line connecting to avatar */}
        <div className="w-0.5 h-4 bg-gray-800 my-1"></div>
      </div>

      {/* Avatar - who did the verdict */}
      <div className="mr-3 shrink-0">
        <Image
          src={getAvatarPath(actor?.userAvatar)}
          className="object-cover w-10 h-10 rounded-full"
          alt={actor?.userName}
        />
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-1 truncate">
          <span className="font-bold text-[15px] hover:underline truncate">
            {actor?.userName}
          </span>
          <span className="text-gray-500 text-[15px] truncate">
            @{actor?.userName} · {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Verdict text with colored icon indicator */}
        <div className={`text-[15px] leading-normal mt-0.5 ${config.color}`}>
          {config.getText(actor?.userName)}
        </div>

        {/* Comment content (if type is comment) */}
        {type === 'comment' && content && (
          <div className="mt-2 text-[15px] text-white">
            "{content}"
          </div>
        )}

        {/* Spark preview (your spark that got the verdict) */}
        <div className="p-3 mt-3 border border-gray-800 rounded-xl bg-gray-900/30">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-gray-400">Your spark</span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">{spark?.content}</p>
        </div>
      </div>
    </article>
  );
};

export default CommentCard;