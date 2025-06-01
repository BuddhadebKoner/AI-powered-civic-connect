import {  NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user.model';
import Authority from '@/models/authority.model';
import Post from '@/models/post.model';

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch total users
    const totalUsers = await User.countDocuments();

    // Fetch total authorities
    const totalAuthorities = await Authority.countDocuments();

    // Fetch pending authority verifications
    const pendingVerifications = await Authority.countDocuments({
      verificationStatus: 'PENDING'
    });

    // Fetch posts data (assuming Post model exists)
    const totalIssues = await Post.countDocuments();
    const resolvedIssues = await Post.countDocuments({ status: 'resolved' });
    const pendingIssues = await Post.countDocuments({ status: 'pending' });

    const dashboardStats = {
      totalUsers,
      totalAuthorities,
      pendingVerifications,
      totalIssues,
      resolvedIssues,
      pendingIssues,
    };

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}