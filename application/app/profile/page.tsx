"use client"

import React from 'react'
import { useUserAuthentication } from '@/context/AuthProvider'

const PostsPage = () => {
  const { user } = useUserAuthentication();
  
  if (!user) return null;

  return (
    <div className="bg-secondary rounded-lg min-h-screen p-4">
      <h2 className="text-xl font-semibold text-white mb-4">My Posts</h2>
      <p className="text-gray-300">
        Your posts will appear here. You currently have {user.postsCount} posts.
      </p>
      {/* Posts will be fetched and displayed later */} 
    </div>
  )
}

export default PostsPage