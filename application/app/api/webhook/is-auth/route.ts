import { NextResponse } from "next/server";
import { auth, currentUser } from '@clerk/nextjs/server'

import { connectToDatabase } from "@/lib/db";

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
      
      // Fetch full user data from Clerk
      const user = await currentUser();
      
      // Extract only the specific user data needed
      const userData = user ? {
         name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
         role: user.publicMetadata?.role || 'user',
         email: user.emailAddresses[0]?.emailAddress || '',
         imageUrl: user.imageUrl
      } : null;
      
      return NextResponse.json(
         { 
            authenticated: true, 
            userId,
            userData  // Return only the specific user info
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Auth check error:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}