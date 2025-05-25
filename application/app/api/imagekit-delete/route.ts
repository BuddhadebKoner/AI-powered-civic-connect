import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import ImageKit from 'imagekit';

export async function DELETE(request: NextRequest) {
    try {
        // Check authentication
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { fileId } = await request.json();

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            );
        }

        // Initialize ImageKit
        const imagekit = new ImageKit({
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
        });

        // Delete the file
        const result = await new Promise((resolve, reject) => {
            imagekit.deleteFile(fileId, (error: Error | null, result: unknown) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        return NextResponse.json({
            success: true,
            result
        });

    } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    }
}
