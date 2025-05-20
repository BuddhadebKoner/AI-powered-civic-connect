"use client";
import React, { useState } from 'react';
import Slidebar from './components/shared/Slidebar/Slidebar';
import Navbar from './components/shared/Navbar/Navbar';

const mockThreads = [
  {
    id: 1,
    user: 'sanjana__upadhyay638',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    caption: 'Radhe Radhe 🙏🙏',
    images: [
      'https://i.imgur.com/jd6zkTZ.jpg',
    ],
    time: '19h',
    likes: 42,
    comments: 1,
  },
  {
    id: 2,
    user: 'amardeepguptakulli',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    caption: 'Jai jai radha raman hari bol #reelshreeradhegovind_dham',
    images: ['https://i.imgur.com/DAzmsrK.jpg'],
    time: '3h',
    likes: 15,
    comments: 3,
  },
];

const Post = ({ post }) => (
  <div className="bg-[#181c20] rounded-2xl p-4 mb-6 max-w-2xl mx-auto border border-gray-800 shadow-lg">
    {/* Header */}
    <div className="flex items-center mb-3">
      <img src={post.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-3" />
      <div>
        <div className="text-white font-medium">{post.user}</div>
        <div className="text-xs text-gray-400">{post.time}</div>
      </div>
    </div>

    {/* Caption */}
    <div className="text-white text-sm mb-3">{post.caption}</div>

    {/* Images */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
      {post.images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="post"
          className="w-full rounded-xl object-cover border border-gray-700"
        />
      ))}
    </div>

    {/* Actions */}
    <div className="flex items-center justify-between text-gray-400 text-sm px-1">
      <div className="flex items-center gap-3">
        <span className="hover:text-pink-500 cursor-pointer">❤️ {post.likes}</span>
        <span className="hover:text-blue-400 cursor-pointer">💬 {post.comments}</span>
        <span className="hover:text-green-400 cursor-pointer">🔗 Share</span>
      </div>
      <span className="text-sm text-gray-600">•••</span>
    </div>
  </div>
);

const Page = () => {
  const [posts] = useState(mockThreads);

  return (
    <div className="min-h-screen bg-[#13171a]">
      <Slidebar />
      <Navbar />
      <main className="max-w-3xl mx-auto pt-24 px-4 pl-20">
        <h2 className="mb-8 text-2xl font-semibold text-white">What's new?</h2>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </main>
    </div>
  );
};

export default Page;
