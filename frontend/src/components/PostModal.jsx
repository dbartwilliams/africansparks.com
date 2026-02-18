import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import CreateSpark from './CreateSpark';

const PostModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - lower z-index */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal container - higher z-index, but content needs to be above backdrop */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[600px] bg-[#15202b] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center px-4 py-3 border-b border-gray-800">
                <button 
                  onClick={onClose}
                  className="p-2 transition-colors rounded-full hover:bg-gray-900"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* CreateTweet Component */}
              <div className="p-4">
                <CreateSpark onSuccess={onClose} />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PostModal;