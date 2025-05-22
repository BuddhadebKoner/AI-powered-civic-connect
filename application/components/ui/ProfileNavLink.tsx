"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

const ProfileNavLink = () => {
   const pathname = usePathname();
   
   // Check if the current path is the posts page (handles both /profile and /profile/)
   const isPostsPage = pathname === '/profile' || pathname === '/profile/';
   
   return (
      <>
         <div className="flex border-b border-gray-800">
            <Link
               href="/profile/"
               className={`flex-1 py-3 text-center font-medium transition-colors active:scale-95 ${
                  isPostsPage
                     ? 'text-white border-b-2 border-white'
                     : 'text-gray-400 hover:text-gray-300'
               }`}
            >
               Posts
            </Link>
            <Link
               href="/profile/replies"
               className={`flex-1 py-3 text-center font-medium transition-colors active:scale-95 ${
                  pathname === '/profile/replies'
                     ? 'text-white border-b-2 border-white'
                     : 'text-gray-400 hover:text-gray-300'
               }`}
            >
               Replies
            </Link>
            <Link
               href="/profile/media"
               className={`flex-1 py-3 text-center font-medium transition-colors active:scale-95 ${
                  pathname === '/profile/media'
                     ? 'text-white border-b-2 border-white'
                     : 'text-gray-400 hover:text-gray-300'
               }`}
            >
               Media
            </Link>
            <Link
               href="/profile/repost"
               className={`flex-1 py-3 text-center font-medium transition-colors active:scale-95 ${
                  pathname === '/profile/repost'
                     ? 'text-white border-b-2 border-white'
                     : 'text-gray-400 hover:text-gray-300'
               }`}
            >
               Reposts
            </Link>
         </div>
      </>
   )
}

export default ProfileNavLink