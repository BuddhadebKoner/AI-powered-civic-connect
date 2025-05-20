import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const HomePage = () => {
  // Example thread data
  const threads = [
    { id: 1, user: 'John Doe', username: '@johndoe', content: 'This is my first thread!', likes: 15, replies: 3, time: '2h ago' },
    { id: 2, user: 'Jane Smith', username: '@janesmith', content: 'Just joined this platform. Looking forward to connecting!', likes: 24, replies: 7, time: '4h ago' },
    { id: 3, user: 'Alex Johnson', username: '@alexj', content: 'Working on a new project. Will share details soon!', likes: 42, replies: 12, time: '6h ago' },
  ];

  return (
    <div className="max-w-2xl mx-auto pt-8 px-4">
      <div className="w-full flex items-center justify-center mb-5 gap-3">
        <p className="font-bold">For You</p>
        <ChevronDown 
          size={20} 
          className="text-icon-disabled cursor-pointer" 
          strokeWidth={2.25} 
        />
      </div>

      {/* Create thread input */}
      <div className="mb-8 bg-surface dark:bg-surface p-4 rounded-lg shadow flex gap-5 justify-between items-center">
        <Image
          src="https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=3880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full mr-3 w-10 h-10"
        />
        <input
          type="text"
          placeholder="What's happening?"
          className="w-full p-2 rounded-lg focus:outline-none"
        />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-foreground text-background rounded-xl font-medium hover:bg-surface-hover transition-colors">
            Post
          </button>
        </div>
      </div>

      {/* Threads feed */}
      <div className="space-y-4">
        {threads.map(thread => (
          <div key={thread.id} className="bg-surface dark:bg-surface p-4 rounded-lg shadow">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-border dark:bg-gray-700 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">{thread.user}</p>
                  <p className="text-icon-disabled text-sm">{thread.username} • {thread.time}</p>
                </div>
                <p className="mt-2">{thread.content}</p>
                <div className="flex items-center space-x-4 mt-3 text-icon-disabled">
                  <button className="flex items-center space-x-1 hover:text-red-500">
                    <span>♥</span>
                    <span>{thread.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-foreground">
                    <span>💬</span>
                    <span>{thread.replies}</span>
                  </button>
                  <button className="hover:text-green-500">
                    <span>🔄</span>
                  </button>
                  <button className="hover:text-foreground">
                    <span>📤</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage