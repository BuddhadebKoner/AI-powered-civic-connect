import { NextResponse } from "next/server";
import { auth, currentUser } from '@clerk/nextjs/server'
import mongoose from "mongoose";
import { nanoid } from 'nanoid';

import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";

const generateUsername = (fullName: string): string => {
   const baseUsername = fullName
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '');

   return `${baseUsername}${nanoid(6)}`;
};

export async function GET() {
   try {
      await connectToDatabase();
      const { userId } = await auth();

      if (!userId) {
         return NextResponse.json(
            { authenticated: false, message: "User not authenticated" },
            { status: 401 }
         );
      }

      const user = await currentUser();

      if (!user) {
         return NextResponse.json(
            { authenticated: false, message: "Unable to fetch user details" },
            { status: 401 }
         );
      }

      const email = user.emailAddresses[0]?.emailAddress || '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         return NextResponse.json(
            { authenticated: false, message: "Invalid email address" },
            { status: 400 }
         );
      }

      const userData = {
         name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
         role: user.publicMetadata?.role || 'user',
         email,
         imageUrl: user.imageUrl
      };

      if (!userData.name) {
         return NextResponse.json(
            { authenticated: false, message: "User name is required" },
            { status: 400 }
         );
      }

      if (userData.role === 'masteradmin') {
         const existingMasterAdmin = await User.findOne({ role: 'masteradmin' });

         if (existingMasterAdmin && existingMasterAdmin.clerkId !== userId) {
            userData.role = 'user';
         }
      }

      let dbUser = await User.findOne({ clerkId: userId });

      if (!dbUser) {
         const username = generateUsername(userData.name);

         dbUser = await User.create({
            clerkId: userId,
            email: userData.email,
            fullName: userData.name,
            profilePictureUrl: userData.imageUrl,
            role: userData.role,
            location: "",
            username: username,
            bio: "",
            isPrivateProfile: false,
         });
      } else {
         if (userData.role !== dbUser.role) {
            if (userData.role === 'masteradmin' && dbUser.role !== 'masteradmin') {
               const existingMasterAdmin = await User.findOne({ role: 'masteradmin' });
               if (existingMasterAdmin) {
                  userData.role = dbUser.role;
               }
            }
         }

         if (dbUser.email !== userData.email ||
            dbUser.fullName !== userData.name ||
            dbUser.profilePictureUrl !== userData.imageUrl ||
            dbUser.role !== userData.role) {

            dbUser.email = userData.email;
            dbUser.fullName = userData.name;
            dbUser.profilePictureUrl = userData.imageUrl;
            dbUser.role = userData.role;
            await dbUser.save();
         }
      }

      return NextResponse.json(
         {
            authenticated: true,
            userId,
            userData: {
               id: dbUser._id,
               email: dbUser.email,
               fullName: dbUser.fullName,
               bio: dbUser.bio,
               username: dbUser.username,
               role: dbUser.role,
               location: dbUser.location,
               profilePictureUrl: dbUser.profilePictureUrl,
               authorityType: dbUser.authorityType,
               department: dbUser.department,
               jurisdiction: dbUser.jurisdiction,
               isPrivateProfile: dbUser.isPrivateProfile,
               postsCount: dbUser.posts.length,
               resolvedPostsCount: dbUser.resolvedPosts.length,
               commentsCount: dbUser.comments.length,
               notificationsCount: dbUser.notifications.length,
            }
         },
         { status: 200 }
      );
   } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
         return NextResponse.json(
            { error: "Invalid user data", details: error.message },
            { status: 400 }
         );
      }

      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}