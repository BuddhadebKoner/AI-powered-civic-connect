import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User, { iUser } from "@/models/user.model";

export async function PUT(request: NextRequest) {
   try {
      const { userId } = await auth();

      if (!userId) {
         return NextResponse.json(
            { authenticated: false, message: "User not authenticated" },
            { status: 401 }
         );
      }

      // Parse request body
      const { fullName, username, bio, isPrivateProfile, profilePictureUrl, profilePictureId } = await request.json();

      // Validate required fields
      if (!fullName?.trim() || !username?.trim()) {
         return NextResponse.json(
            { authenticated: false, message: "Full name and username are required" },
            { status: 400 }
         );
      }

      // Validate username format
      const cleanUsername = username.trim();
      if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
         return NextResponse.json(
            { authenticated: false, message: "Username can only contain letters, numbers, and underscores" },
            { status: 400 }
         );
      }

      if (cleanUsername.length < 3) {
         return NextResponse.json(
            { authenticated: false, message: "Username must be at least 3 characters long" },
            { status: 400 }
         );
      }

      // Connect to database
      await connectToDatabase();

      // Get current user from database to check if username actually changed
      const currentDbUser = await User.findOne({ clerkId: userId });
      if (!currentDbUser) {
         return NextResponse.json(
            { authenticated: false, message: "User not found" },
            { status: 404 }
         );
      }

      // Only check username uniqueness if username is actually changing
      if (cleanUsername.toLowerCase() !== currentDbUser.username.toLowerCase()) {
         const existingUser = await User.findOne({
            username: cleanUsername.toLowerCase(),
            clerkId: { $ne: userId }
         });

         if (existingUser) {
            return NextResponse.json(
               { authenticated: false, message: "Username is already taken" },
               { status: 409 }
            );
         }
      }

      // Prepare update data for database
      const dbUpdateData: Partial<iUser> = {
         fullName: fullName.trim(),
         username: cleanUsername.toLowerCase(),
         bio: bio?.trim() || "",
         isPrivateProfile: Boolean(isPrivateProfile)
      };

      // Add profile picture data if provided
      if (profilePictureUrl) {
         dbUpdateData.profilePictureUrl = profilePictureUrl;
      }
      if (profilePictureId) {
         dbUpdateData.profilePictureId = profilePictureId;
      }

      // Update user in database
      const updatedUser = await User.findOneAndUpdate(
         { clerkId: userId },
         dbUpdateData,
         { new: true, runValidators: true }
      );

      if (!updatedUser) {
         return NextResponse.json(
            { authenticated: false, message: "User not found in database" },
            { status: 404 }
         );
      }

      // Return success response with updated user data
      return NextResponse.json({
         authenticated: true,
         message: "Profile updated successfully",
         user: {
            clerkId: updatedUser.clerkId,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            username: updatedUser.username,
            bio: updatedUser.bio,
            isPrivateProfile: updatedUser.isPrivateProfile,
            profilePictureUrl: updatedUser.profilePictureUrl,
            profilePictureId: updatedUser.profilePictureId,
            location: updatedUser.location,
            role: updatedUser.role
         }
      }, { status: 200 });

   } catch (error: unknown) {
      console.error("Error updating user profile:", error);

      // Handle specific MongoDB errors
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
         return NextResponse.json(
            { authenticated: false, message: "Invalid data provided" },
            { status: 400 }
         );
      }

      if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
         return NextResponse.json(
            { authenticated: false, message: "Username or email already exists" },
            { status: 409 }
         );
      }

      return NextResponse.json(
         { authenticated: false, message: "Error updating user profile" },
         { status: 500 }
      );
   }
}