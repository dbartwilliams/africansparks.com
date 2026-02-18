
import React, { useState } from 'react';
import { MoreHorizontal, Trash2, BarChart2, Flag, Repeat2} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useDeleteSpark } from '../tanstack/queries/sparkQueries';
import CommentModal from './CommentModal';
import SparkActions from './SparkActions';
import Image from '../components/Image';
import ImageModal from '../layouts/ImageModal';
import { Link } from 'react-router-dom';
import { getSparkImagePath, getAvatarPath } from '../util/imageKitHelper';


const SparkCard = ({ spark }) => {
  const { user } = useAuthStore();
  const { mutate: deleteSpark, isPending: isDeleting } = useDeleteSpark();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // ✅ ADD THIS ERROR HANDLING BLOCK
    if (!spark) {
      return <div className="p-4 text-red-500 border border-red-500">Missing spark data</div>;
    }
    
  // Check if this is a ReSpark
  const isReSpark = spark.isReSpark || false;
  const originalSpark = spark.originalSpark;

  // Get images array (handle both old 'image' and new 'images' fields)
  // For resparks, use original spark's images if no new ones
  const images = spark.images?.length > 0 
    ? spark.images 
    : spark.image 
      ? [spark.image] 
      : isReSpark && originalSpark?.images?.length > 0
        ? originalSpark.images
        : isReSpark && originalSpark?.image
          ? [originalSpark.image]
          : [];

  const imageUrls = images.map(img => getSparkImagePath(img));

  // Compute counts
  const computedSpark = {
    ...spark,
    likesCount: spark.likesCount ?? (Array.isArray(spark.likes) ? spark.likes.length : 0),
    resparksCount: spark.resparksCount ?? (Array.isArray(spark.resparks) ? spark.resparks.length : 0),
    commentsCount: spark.commentsCount ?? 0,
    isLiked: spark.isLiked ?? spark.likes?.includes(user?._id) ?? false,
    isResparked: spark.isResparked ?? spark.resparks?.includes(user?._id) ?? false,
  };

  const isAuthor = user?._id === spark.authorId || user?._id === spark.author?._id;

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteSpark(spark._id, { onSuccess: () => setShowDropdown(false) });
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Helper to get author info (handle both populated and unpopulated)
  const getAuthorInfo = (sparkData) => ({
    _id: sparkData.authorId || sparkData.author?._id,
    name: sparkData.name || sparkData.author?.userName,
    handle: sparkData.handle || `@${sparkData.author?.userName}`,
    avatar: sparkData.userAvatar || sparkData.author?.userAvatar,
  });

  const author = getAuthorInfo(spark);
  const originalAuthor = isReSpark && originalSpark ? getAuthorInfo(originalSpark) : null;

  return (
    <>
      <article 
        className={`relative flex px-4 py-3 transition-colors border-b border-gray-700 cursor-pointer hover:bg-gray-900 ${
          isReSpark ? 'bg-slate-900/50' : 'bg-slate-850'
        }`}
      >
        <div className="mr-3 shrink-0">
          <Link 
            to={`/profile/${author._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getAvatarPath(author.avatar)}
              alt={author.name}
              className="object-cover w-12 h-12 rounded-full hover:opacity-80"
            />
          </Link>
        </div>
    
        <div className="flex-1 min-w-0">
          {/* ReSpark Header */}
          {isReSpark && (
            <div className="flex items-center gap-2 mb-1 text-gray-500 text-[13px]">
              <Repeat2 className="w-4 h-4 text-green-500" />
              <span>
                ReSparked by{' '}
                <Link 
                  to={`/profile/${author._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-bold text-gray-400 hover:underline"
                >
                  {author.name}
                </Link>
              </span>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between spark-card-header">
            <div className="flex items-center gap-1 truncate">
              <span className="font-bold text-[18px] truncate mr-1 cursor-pointer inline-block text-white"
                onClick={(e) => e.stopPropagation()} 
              >
                {author.name}
              </span>
              <span className="text-gray-500 text-[15px] truncate">
                {author.handle} · {new Date(spark.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-8 h-8 p-2 text-gray-500 transition-colors rounded-full hover:text-blue-500 hover:bg-blue-500/10"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-50 w-48 mt-1 overflow-hidden bg-black border border-gray-800 shadow-lg top-full rounded-xl"
                  >
                    {isAuthor && (
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center w-full gap-3 px-4 py-3 text-red-500 transition-colors cursor-pointer hover:bg-gray-900 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </span>
                      </button>
                    )}

                    {isAuthor && (
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center w-full gap-3 px-4 py-3 text-white transition-colors cursor-pointer hover:bg-gray-900"
                      >
                        <BarChart2 className="w-4 h-4" />
                        <span className="text-sm font-medium">View analytics</span>
                      </button>
                    )}

                    {isAuthor && (
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center w-full gap-3 px-4 py-3 text-white transition-colors cursor-pointer hover:bg-gray-900"
                      >
                        <Flag className="w-4 h-4" />
                        <span className="text-sm font-medium">Report spark</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Optional Quote Comment (for quote-resparks) */}
          {isReSpark && spark.reSparkComment && (
            <div className="mt-2 text-[16px] text-white leading-normal">
              {spark.reSparkComment}
            </div>
          )}

          {/* Content - Original Spark Embed or Regular Content */}
          {isReSpark && originalSpark ? (
            // Embedded Original Spark
            <div 
              className="mt-3 overflow-hidden transition-colors border border-gray-700 rounded-lg hover:bg-gray-800/50"
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to original spark
                window.location.href = `/spark/${originalSpark._id}`;
              }}
            >
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={getAvatarPath(originalAuthor?.avatar)}
                    alt={originalAuthor?.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-bold text-[15px] text-white">{originalAuthor?.name}</span>
                  <span className="text-gray-500 text-[13px]">{originalAuthor?.handle}</span>
                </div>
                <p className="text-[15px] text-gray-300 leading-normal line-clamp-3">
                  {originalSpark.content}
                </p>
                
                {/* Original Spark Images Preview */}
                {originalSpark.images?.length > 0 || originalSpark.image ? (
                  <div className="mt-2 overflow-hidden rounded-lg opacity-80">
                    <Image
                      src={getSparkImagePath(
                        originalSpark.images?.[0] || originalSpark.image
                      )}
                      alt="Original spark"
                      className="object-cover w-full h-32"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            // Regular Spark Content
            <>
              <Link to={`spark/${spark._id}`}>
              <div className="text-[16px] leading-normal mt-0.5 break-words whitespace-pre-wrap text-white">
                {spark.content}
              </div>
              </Link>

              {/* Images Grid */}
              {images.length > 0 && (
                <div className={`mt-3 grid gap-2 ${images.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {images.map((filename, index) => (
                    <div 
                      key={index}
                      className="relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(index);
                      }}
                    >
                      <Image
                        src={getSparkImagePath(filename)}
                        alt={`Spark image ${index + 1}`}
                        className="object-cover w-full max-h-64"
                      />
                    </div>
                  ))}
                </div>
              )}
              
            </>
          )}

          {/* Actions */}
          <SparkActions
            spark={computedSpark}
            onCommentClick={() => setIsCommentModalOpen(true)}
          />
        </div>
      </article>
      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        spark={spark}
      />

      {/* Image Modal */}
      <ImageModal 
        images={imageUrls}
        currentIndex={currentImageIndex}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
};

export default SparkCard;

