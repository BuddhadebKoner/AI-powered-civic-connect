import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Authority from '@/models/authority.model';
import User from '@/models/user.model';

export async function GET() {
  try {
    await connectToDatabase();

    const authorities = await Authority.find()
      .populate('userId', 'fullName email username')
      .sort({ createdAt: -1 });

    return NextResponse.json(authorities);
  } catch (error) {
    console.error('Authorities GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authorities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { userId, position, contactInfo, expertise, area } = body;

    // Validate required fields
    if (!userId || !position || !contactInfo || !area) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has authority record
    const existingAuthority = await Authority.findOne({ userId });
    if (existingAuthority) {
      return NextResponse.json(
        { error: 'User already has an authority record' },
        { status: 400 }
      );
    }

    // Create new authority
    const newAuthority = new Authority({
      userId,
      position,
      contactInfo,
      expertise: expertise || [],
      area,
      verificationStatus: 'PENDING'
    });

    await newAuthority.save();

    // Update user role to authority
    await User.findByIdAndUpdate(userId, { role: 'authority' });

    // Populate user info before returning
    await newAuthority.populate('userId', 'fullName email username');

    return NextResponse.json(newAuthority, { status: 201 });
  } catch (error) {
    console.error('Create Authority Error:', error);
    return NextResponse.json(
      { error: 'Failed to create authority' },
      { status: 500 }
    );
  }
}