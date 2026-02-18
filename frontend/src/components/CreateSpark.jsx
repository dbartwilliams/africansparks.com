import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Smile, Calendar, MapPin, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useCreateSpark } from "../tanstack/queries/sparkQueries";
import { useAuthStore } from "../store/authStore";
import { getAvatarPath } from '../util/imageKitHelper';
import Image from '../components/Image';

const CreateSpark = ({ onSuccess }) => {
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]); // Changed to array
  const [previews, setPreviews] = useState([]); // Changed to array
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const { user } = useAuthStore();
  const { mutate, isPending } = useCreateSpark();
  
  const MAX_CHARS = 280;
  const MAX_IMAGES = 2; // Max 2 images
  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Preview management for multiple images
  useEffect(() => {
    // Create preview URLs for all selected images
    const urls = selectedImages.map(file => URL.createObjectURL(file));
    setPreviews(urls);
    
    // Cleanup - only revoke the URLs we created in this effect run
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  // Close emoji picker on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onEmojiClick = (emojiData) => {
    const cursor = textareaRef.current.selectionStart;
    const text = content.slice(0, cursor) + emojiData.emoji + content.slice(cursor);
    setContent(text);
    setShowEmojiPicker(false);
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(cursor + emojiData.emoji.length, cursor + emojiData.emoji.length);
    }, 0);
  };

  const handleImageSelect = (e) => {
    setError(null);
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Check if adding these would exceed max
    if (selectedImages.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed. You can add ${MAX_IMAGES - selectedImages.length} more.`);
      e.target.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    const validFiles = [];
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, JPG, GIF, PNG, WEBP allowed.');
        continue;
      }

      if (file.size > maxSize) {
        setError('Each image must be less than 5MB.');
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles]);
    }
    
    e.target.value = '';
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!content.trim() && selectedImages.length === 0) || isOverLimit) return;

    const formData = new FormData();
    formData.append('content', content);
    // Append all images with same field name 'images' (plural)
    selectedImages.forEach((image, index) => {
      formData.append('images', image);
    });

    mutate(formData, {
      onSuccess: () => {
        setContent('');
        setSelectedImages([]);
        setPreviews([]);
        setShowEmojiPicker(false);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        onSuccess?.();
      },
    });
  };

  // Determine grid layout based on number of images
  const getGridClass = () => {
    if (previews.length === 1) return 'grid-cols-1';
    if (previews.length === 2) return 'grid-cols-2 gap-2';
    return '';
  };

  return (
    <div className="p-4 border-b border-gray-800">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {user && (
            <Image
              src={getAvatarPath(user?.userAvatar)}
              alt="img" 
              className="object-cover w-10 h-10 rounded-full"
            />
          )}
          
          <div className="flex-1">
            {/* TEXTAREA */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Spark a conversation!"
              className="w-full overflow-hidden text-lg text-white placeholder-gray-400 bg-transparent border-none resize-none focus:outline-none"
              rows="1"
              style={{ minHeight: '44px' }}
              disabled={isPending}
            />

            {/* EMOJI PICKER */}
            {showEmojiPicker && (
              <div className="absolute z-50 mt-2 emoji-picker-container">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  theme="dark"
                  skinTonesDisabled
                  searchDisabled
                  height={350}
                  width={300}
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}

            {/* IMAGE PREVIEWS - Grid Layout */}
            {previews.length > 0 && (
              <div className={`grid ${getGridClass()} mb-3 overflow-hidden border border-gray-700 rounded-xl`}>
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute p-2 text-white transition-colors rounded-full bg-black/60 top-2 right-2 hover:bg-black/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div 
                onClick={() => setError(null)}
                className="p-3 mb-3 transition-colors border rounded-lg cursor-pointer bg-red-500/10 border-red-500/50 hover:bg-red-500/20"
              >
                <p className="text-sm font-semibold text-red-400">
                  ⚠️ {error} <span className="text-xs opacity-75">(click to dismiss)</span>
                </p>
              </div>
            )}

            {/* FOOTER */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-800">
              <div className="flex gap-1 text-[#5eeccc] relative">
                {/* Image Upload - allow multiple if less than 2 images */}
                <label className={`p-2 transition-colors rounded-full cursor-pointer hover:bg-gray-900 ${selectedImages.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <ImageIcon className="w-5 h-5" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isPending || selectedImages.length >= MAX_IMAGES}
                    multiple={selectedImages.length < MAX_IMAGES} // Allow multiple selection if room
                  />
                </label>
                
                <span className="self-center text-xs text-gray-500">
                  {selectedImages.length}/{MAX_IMAGES}
                </span>
                
                {/* Emoji Button */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 rounded-full transition-colors ${showEmojiPicker ? 'bg-gray-900' : 'hover:bg-gray-900'}`}
                  disabled={isPending}
                >
                  <Smile className="w-5 h-5" />
                </button>
                
                <button type="button" className="p-2 transition-colors rounded-full hover:bg-gray-900" disabled={isPending}>
                  <Calendar className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 transition-colors rounded-full hover:bg-gray-900" disabled={isPending}>
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Character Counter */}
                {charCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6">
                      <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#374151" strokeWidth="2" />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke={isOverLimit ? '#ef4444' : charCount > 260 ? '#fbbf24' : '#5eeccc'}
                          strokeWidth="2"
                          strokeDasharray={`${Math.min((charCount / MAX_CHARS) * 100, 100)} 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      {charCount > 260 && (
                        <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${isOverLimit ? 'text-red-500' : 'text-yellow-400'}`}>
                          {MAX_CHARS - charCount}
                        </span>
                      )}
                    </div>
                    {isOverLimit && <span className="text-sm text-red-500">{charCount - MAX_CHARS} over</span>}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={(!content.trim() && selectedImages.length === 0) || isOverLimit || isPending}
                  className="px-5 py-2 bg-[#5eeccc] text-black font-bold rounded hover:bg-[#4dd9b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSpark;
