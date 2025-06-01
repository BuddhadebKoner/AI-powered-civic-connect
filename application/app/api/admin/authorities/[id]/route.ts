import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Authority from '@/models/authority.model';

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

      const authority = await Authority.findById(id);
      if (!authority) {
         return NextResponse.json(
            { error: 'Authority not found' },
            { status: 404 }
         );
      }

      // Update authority
      const updatedAuthority = await Authority.findByIdAndUpdate(
         id,
         body,
         { new: true }
      ).populate('userId', 'fullName email username');

      return NextResponse.json(updatedAuthority);
   } catch (error) {
      console.error('Update Authority Error:', error);
      return NextResponse.json(
         { error: 'Failed to update authority' },
         { status: 500 }
      );
   }
}