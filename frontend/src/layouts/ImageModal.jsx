import React from 'react';
import { X } from 'lucide-react';
import Image from '../components/Image';

const ImageModal = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }) => {
  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button 
        className="absolute z-10 p-2 text-white rounded-full top-4 right-4 hover:bg-white/10"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute z-10 text-sm text-white -translate-x-1/2 top-4 left-1/2">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* MAIN IMAGE - This was missing! */}
      <Image 
          src={currentImage}
          alt="Enlarged" 
          className="object-contain w-full h-full"
          style={{ maxWidth: '95vw', maxHeight: '95vh' }}
          onClick={(e) => e.stopPropagation()}
        />

      {/* Navigation arrows for multiple images */}
      {images.length > 1 && (
        <>
          <button
            className="absolute z-10 p-3 text-white rounded-full left-4 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            ←
          </button>
          <button
            className="absolute z-10 p-3 text-white rounded-full right-4 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            →
          </button>
        </>
      )}
    </div>
  );
};

export default ImageModal;