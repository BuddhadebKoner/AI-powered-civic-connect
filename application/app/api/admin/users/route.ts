import {  NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user.model';

export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find()
      .select('fullName email username role location isPrivateProfile posts createdAt updatedAt')
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Users GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}