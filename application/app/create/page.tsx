'use client';

import React from 'react';
import FileUpload from '@/components/FileUpload';

const CreatePage = () => {
  const handleUploadSuccess = (response: unknown) => {
    console.log('Upload successful:', response);
    // You can handle the uploaded file here
    // For example, add it to a post or update state
  };

  const handleUploadError = (error: unknown) => {
    console.error('Upload failed:', error);
    // Handle upload error
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share what&apos;s happening in your community
        </p>
      </div>

      <div className="space-y-6">
        {/* Post Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What&apos;s on your mind?
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 resize-none transition-all duration-200"
            placeholder="Share your thoughts, concerns, or updates about your community..."
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Add Images (Optional)
          </label>
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            accept="image/*"
            maxSize={5}
          />
        </div>

        {/* Post Button */}
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;