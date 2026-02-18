import React from "react";
import Image from "../components/Image";
import { getAvatarPath } from "../util/imageKitHelper";
import { Link } from "react-router-dom";

const SparkPageComments = ({ comment }) => {
  if (!comment) return null;

  const { author, content, createdAt } = comment;

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-gray-800">
     <Link to={`/profile/${author?._id}`}>
      <Image
        src={getAvatarPath(author?.userAvatar)}
        className="object-cover rounded-full w-9 h-9"
        alt={author?.userName}
      />
    </Link>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {author?.userName}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>

        <p className="mt-1 text-white">{content}</p>
      </div>
    </div>
  );
};

export default SparkPageComments;
