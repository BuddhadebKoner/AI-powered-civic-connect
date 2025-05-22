import React, { memo } from 'react';
import Image from 'next/image';
import { Lock, User, Shield, Building } from 'lucide-react'; // Added role icons
import { UserTypeContext } from '@/types';

interface ProfileInfoProps {
   user: UserTypeContext;
   onEditProfile?: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, onEditProfile }) => {
   // Get initials for avatar fallback
   const getInitials = (): string => {
      if (user.fullName && user.fullName.length > 0) return user.fullName.charAt(0);
      if (user.username && user.username.length > 0) return user.username.charAt(0);
      return '?';
   };

   const RoleBadge = () => {
      if (!user.role) return null;

      switch (user.role) {
         case 'masteradmin':
            return (
               <div className="flex items-center px-2 py-0.5 rounded-full text-xs border bg-purple-900/60 text-purple-200 border-purple-700">
                  <Shield size={14} className="mr-1" />
                  Master Admin
               </div>
            );
         case 'authority':
            return (
               <div className="flex items-center px-2 py-0.5 rounded-full text-xs border bg-blue-900/60 text-blue-200 border-blue-700">
                  <Building size={14} className="mr-1" />
                  Authority
               </div>
            );
         case 'user':
            return (
               <div className="flex items-center px-2 py-0.5 rounded-full text-xs border bg-gray-800 text-gray-300 border-gray-700">
                  <User size={14} className="mr-1" />
                  Citizen
               </div>
            );
         default:
            return null;
      }
   };

   return (
      <div className="p-4">
         <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
               {/* User identity */}
               <h2 className="text-2xl font-bold mb-1">{user.fullName || 'Anonymous User'}</h2>
               <p>{user.email}</p>
               <div className="flex items-center gap-2 mb-3">
                  {user.username && <p className="text-gray-400">@{user.username}</p>}
                  <RoleBadge />
                  {user.isPrivateProfile && (
                     <span aria-label="Private Profile">
                        <Lock size={16} className="text-gray-400" />
                     </span>
                  )}
               </div>

               {/* Bio */}
               <p className="text-white mb-3">{user.bio || user.location || "No bio added"}</p>

               {/* Stats */}
               <div className="flex gap-4 mb-4">
                  <div className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700">
                     {user.postsCount || 0} Posts
                  </div>
                  <div className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700">
                     {user.resolvedPostsCount || 0} Resolved
                  </div>
               </div>
            </div>

            {/* Profile Picture */}
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700 ml-4">
               {user.profilePictureUrl ? (
                  <Image
                     src={user.profilePictureUrl}
                     alt={`${user.fullName || user.username || "User"}'s profile picture`}
                     width={80}
                     height={80}
                     className="w-full h-full object-cover"
                     priority
                  />
               ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                     <span className="text-2xl text-white font-bold">{getInitials()}</span>
                  </div>
               )}
            </div>
         </div>

         {/* Edit Profile Button */}
         <button
            onClick={onEditProfile}
            className="w-full py-2 border border-gray-600 rounded-lg text-white font-medium hover:bg-gray-900 transition-colors mb-6"
         >
            Edit profile
         </button>
      </div>
   );
};

// Use memo to prevent unnecessary re-renders
export default memo(ProfileInfo);