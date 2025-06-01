"use client"

import { useUserAuthentication } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { ArrowLeft, MoreVertical, LogOut, Edit3 } from 'lucide-react'
import ProfileNavLink from '@/components/ui/ProfileNavLink'
import ProfileInfo from '@/components/ui/ProfileInfo'
import EditProfile from '@/components/popups/EditProfile'
import { useClerk } from '@clerk/clerk-react'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
   const { user, isAuthenticated, isLoading, error } = useUserAuthentication();
   const router = useRouter();
   const { signOut } = useClerk();
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const [editProfileOpen, setEditProfileOpen] = useState(false);
   const [hasRedirected, setHasRedirected] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   // Handle sign out
   const handleSignOut = async () => {
      try {
         setDropdownOpen(false);
         await signOut();
      } catch (error) {
         console.error("Sign out failed:", error);
         // Optionally show a toast notification here
      }
   };

   // Handle edit profile
   const handleEditProfile = () => {
      setDropdownOpen(false);
      setEditProfileOpen(true);
   };

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

   // Redirect unauthenticated users
   useEffect(() => {
      if (!isLoading && !isAuthenticated) {
         router.push('/sign-in');
      }
   }, [isLoading, isAuthenticated, router]);

   // Enhanced role-based routing with security checks
   useEffect(() => {
      if (user && isAuthenticated && !hasRedirected) {
         const currentPath = window.location.pathname;
         
         // Define role-based route mappings
         const roleRoutes = {
            masteradmin: '/profile/masteradmin',
            authority: '/profile/authority',
            citizen: '/profile/posts'
         };

         // Get the correct route for user's role
         const correctRoute = roleRoutes[user.role as keyof typeof roleRoutes];
         
         if (!correctRoute) {
            console.error('Invalid user role:', user.role);
            return;
         }

         // Check if user is trying to access unauthorized routes
         const isUnauthorizedAccess = () => {
            switch (user.role) {
               case 'masteradmin':
                  // Master admin can only access their dashboard
                  return !currentPath.includes('/profile/masteradmin') && currentPath !== '/profile';
               
               case 'authority':
                  // Authority can only access their dashboard
                  return !currentPath.includes('/profile/authority') && currentPath !== '/profile';
               
               case 'citizen':
                  // Citizens cannot access admin/authority routes
                  return currentPath.includes('/masteradmin') || 
                         currentPath.includes('/authority') || 
                         currentPath === '/profile';
               
               default:
                  return true;
            }
         };

         // Redirect if unauthorized access or if on base /profile route
         if (isUnauthorizedAccess() || currentPath === '/profile') {
            setHasRedirected(true);
            router.replace(correctRoute);
         }
      }
   }, [user, isAuthenticated, hasRedirected, router]);

   // Reset redirect flag when user changes
   useEffect(() => {
      setHasRedirected(false);
   }, [user?.id]);

   // if (isLoading) {
   //    return (
   //       <div className="flex flex-col items-center justify-center min-h-screen bg-black">
   //          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
   //          <p className="mt-4 text-xl font-semibold text-white">Loading profile...</p>
   //       </div>
   //    );
   // }

   if (error) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            <p className="text-xl font-semibold text-red-500">Error loading profile: {error}</p>
            <button 
               onClick={() => router.push('/sign-in')} 
               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
               Return to Sign In
            </button>
         </div>
      );
   }

   if (!user) return null;

   return (
      <div className={`min-h-screen bg-black text-white flex flex-col p-4 ${
         user.role === 'masteradmin' ? 'max-w-7xl' : 'max-w-3xl'
      } mx-auto`}>
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
               <h1 className="text-lg font-semibold">
                  {user.role === 'masteradmin' ? 'Master Admin' : 
                   user.role === 'authority' ? 'Authority Dashboard' : 'Profile'}
               </h1>
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
                           onClick={handleEditProfile}
                           className="flex items-center w-full px-4 py-3 text-left transition-all duration-200 hover:bg-gray-800/70 group"
                        >
                           <div className="p-1.5 mr-3 bg-blue-600/20 rounded-full border border-blue-500/30 flex items-center justify-center">
                              <Edit3 size={16} className="text-blue-400" />
                           </div>
                           <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
                              Edit Profile
                           </span>
                        </button>

                        <div className="h-px bg-gray-700/50 my-1 mx-2"></div>

                        <button
                           onClick={handleSignOut}
                           className="flex items-center w-full px-4 py-3 text-left transition-all duration-200 hover:bg-red-900/30 group"
                        >
                           <div className="p-1.5 mr-3 bg-red-600/20 rounded-full border border-red-500/30 flex items-center justify-center">
                              <LogOut size={16} className="text-red-400" />
                           </div>
                           <span className="text-white font-medium group-hover:text-red-400 transition-colors">
                              Sign Out
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

               <div className="p-4">
                  {/* Profile Section - Only show for citizens and authorities */}
                  {user.role !== 'masteradmin' && (
                     <ProfileInfo
                        user={user}
                        onEditProfile={handleEditProfile}
                     />
                  )}

                  {user.role === 'masteradmin' ? (
                     <div className={user.role === 'masteradmin' ? '' : 'mt-4'}>
                        {children}
                     </div>
                  ) : user.role === 'authority' ? (
                     <div className="mt-4">
                        {children}
                     </div>
                  ) : (
                     <>
                        {/* Navigation Tabs - Only for citizens */}
                        <div className="mt-6">
                           <ProfileNavLink />
                        </div>

                        {/* Content Section */}
                        <div className="mt-4">
                           {children}
                        </div>
                     </>
                  )}
               </div>
            </div>
         </div>

         {/* Edit Profile Modal */}
         <EditProfile
            isOpen={editProfileOpen}
            onClose={() => setEditProfileOpen(false)}
         />
      </div>
   );
}