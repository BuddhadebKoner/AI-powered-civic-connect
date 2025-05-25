'use client';

import React from 'react';
import CreatePostForm from '@/components/forms/CreatePostForm';

const CreatePage = () => {

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

      <CreatePostForm
        onSubmit={(data) => {
          console.log('Post data:', data);
          // Handle post submission logic here
        }}
        onUploadSuccess={(data) => {
          console.log('Upload success:', data);
          // Handle upload success logic here
        }}
        onUploadError={(error) => {
          console.error('Upload error:', error);
          // Handle upload error logic here
        }}
      />
    </div>
  );
};

export default CreatePage;