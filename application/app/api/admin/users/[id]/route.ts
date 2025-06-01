import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user.model';

export async function PATCH(
   request: NextRequest,
   context: { params: Promise<{ id: string }> }
) {
   try {
      await connectToDatabase();

      const body = await request.json();
      const { params } = context;
      const resolvedParams = await params;
      const { id } = resolvedParams;
      const { role } = body;

      // Validate role
      if (!role || !['user', 'authority', 'masteradmin'].includes(role)) {
         return NextResponse.json(
            { error: 'Invalid role provided' },
            { status: 400 }
         );
      }

      const user = await User.findById(id);
      if (!user) {
         return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
         );
      }

      // Update user role
      const updatedUser = await User.findByIdAndUpdate(
         id,
         { role },
         { new: true }
      ).select('fullName email username role location isPrivateProfile posts createdAt updatedAt');

      return NextResponse.json(updatedUser);
   } catch (error) {
      console.error('Update User Role Error:', error);
      return NextResponse.json(
         { error: 'Failed to update user role' },
         { status: 500 }
      );
   }
}