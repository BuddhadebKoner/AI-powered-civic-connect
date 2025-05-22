"use client"

import { useUserAuthentication } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { ArrowLeft, MoreVertical } from 'lucide-react'
import ProfileNavLink from '@/components/ui/ProfileNavLink'
import ProfileInfo from '@/components/ui/ProfileInfo'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
   const { user, isAuthenticated, isLoading, error } = useUserAuthentication();
   const router = useRouter();

   useEffect(() => {
      if (!isLoading && !isAuthenticated) {
         router.push('/login');
      }
   }, [isLoading, isAuthenticated, router]);

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-xl font-semibold text-white">Loading profile...</p>
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            <p className="text-xl font-semibold text-red-500">Error loading profile: {error}</p>
         </div>
      );
   }

   if (!user) return null;

   return (
      <div className="min-h-screen bg-black text-white max-w-3xl mx-auto">
         {/* Header */}
         <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <button
               onClick={() => router.back()}
               className="p-2 hover:bg-gray-900 rounded-full transition-colors"
               aria-label="Go back"
            >
               <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold">Profile</h1>
            <button
               className="p-2 hover:bg-gray-900 rounded-full transition-colors"
               aria-label="More options"
            >
               <MoreVertical size={20} />
            </button>
         </div>

         {/* Profile Section */}
         <ProfileInfo
            user={user}
            onEditProfile={() => {
               console.log('Edit profile clicked');
            }}
         />

         {
            user.role === 'masteradmin' ? (
               <>
                  <h1>
                     Master Admin Profile
                  </h1>
               </>
            ) : user.role === 'authority' ? (
               <>
                  <h1>
                     Authority Profile
                  </h1>
               </>
            ) : (
               <>
                  {/* Navigation Tabs */}
                  <ProfileNavLink />

                  {/* Content Section */}
                  <div className="p-4">
                     {children}
                  </div>
               </>
            )
         }
      </div >
   );
}