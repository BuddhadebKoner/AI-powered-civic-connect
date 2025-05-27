'use client';

import React, { useState, useEffect, useRef } from 'react';
import CreatePostForm from '@/components/forms/CreatePostForm';
import { useUserAuthentication } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Save, FileText } from 'lucide-react';


const CreatePage = () => {
  const { isAuthenticated, isLoading, } = useUserAuthentication();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if the user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl font-semibold text-white">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSaveDraft = () => {
    setDropdownOpen(false);
    // Add save draft functionality here
    console.log('Save as draft');
  };

  const handlePreview = () => {
    setDropdownOpen(false);
    // Add preview functionality here
    console.log('Preview post');
  };

  return (
    <div className="min-h-screen bg-black text-white max-w-3xl mx-auto flex flex-col p-4">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md z-30 px-4 py-4 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-900 rounded-full transition-colors group"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="group-hover:text-blue-400 transition-colors" />
          </button>
          <h1 className="text-lg font-semibold">Create Post</h1>
          <div className="relative cursor-pointer" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 hover:bg-gray-900 rounded-full transition-colors cursor-pointer group"
              aria-label="More options"
            >
              <MoreVertical size={20} className="group-hover:text-blue-400 transition-colors" />
            </button>

            {/* Enhanced Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] backdrop-blur-md rounded-xl shadow-2xl z-10 py-2 border border-gray-700/50 animate-fadeIn">
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center w-full px-4 py-3 text-left transition-all duration-200 hover:bg-gray-800/70 group"
                >
                  <div className="p-1.5 mr-3 bg-green-600/20 rounded-full border border-green-500/30 flex items-center justify-center">
                    <Save size={16} className="text-green-400" />
                  </div>
                  <span className="text-white font-medium group-hover:text-green-400 transition-colors">
                    Save as Draft
                  </span>
                </button>

                <div className="h-px bg-gray-700/50 my-1 mx-2"></div>

                <button
                  onClick={handlePreview}
                  className="flex items-center w-full px-4 py-3 text-left transition-all duration-200 hover:bg-blue-900/30 group"
                >
                  <div className="p-1.5 mr-3 bg-blue-600/20 rounded-full border border-blue-500/30 flex items-center justify-center">
                    <FileText size={16} className="text-blue-400" />
                  </div>
                  <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
                    Preview Post
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className='bg-[#181818] rounded-t-4xl shadow-lg min-h-[calc(100vh-80px)] relative'>
          <div className="p-6">
            {/* Header Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Share Your Issue
              </h2>
              <p className="text-gray-400">
                Report civic issues and help improve your community
              </p>
            </div>

            {/* Form Section */}
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
        </div>
      </div>
    </div>
  );
};

export default CreatePage;