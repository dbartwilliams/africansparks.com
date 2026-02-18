
import React, { useState } from 'react';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';

export default function ImageUpload({ onFileSelect }) {
  const [preview, setPreview] = useState(null);   // object URL
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const remove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    onFileSelect(null);
  };

  return (
    <>
      <input
        id="upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />

      {/* Preview inside textarea area - shown above text input */}
      {preview && (
        <div className="relative mb-3 overflow-hidden border border-gray-700 rounded-xl group">
          <img
            src={preview}
            alt="Preview"
            className="object-cover w-full max-h-80"
          />
          <button
            type="button"
            onClick={remove}
            className="absolute p-2 text-white transition rounded-full bg-black/60 top-2 right-2 hover:bg-black/80"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload button - icon only, like Twitter */}
      <label
        htmlFor="upload"
        className="inline-flex p-2 text-[#5eeccc] transition-colors rounded-full cursor-pointer hover:bg-gray-900"
      >
        <FiImage className="w-5 h-5" />
      </label>
    </>
  );
}