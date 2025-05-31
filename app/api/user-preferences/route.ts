// app/api/user-preferences/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const userPreferencesSchema = z.object({
  userId: z.string().min(1, 'User ID cannot be empty'),
  language: z.enum(['en', 'uk', 'pl']).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { identifier: userId },
      include: { preferences: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.preferences) {
        // Create default preferences if none exist
        const defaultPreferences = await prisma.userPreferences.create({
            data: {
                userId: user.id,
                language: 'en', // Default language
            }
        });
        return NextResponse.json(defaultPreferences, { status: 200 });
    }

    return NextResponse.json(user.preferences, { status: 200 });
  } catch (error) {
    console.error('Failed to get user preferences:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validation = userPreferencesSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 });
    }

    const { userId, language } = validation.data;

    const user = await prisma.user.findUnique({
      where: { identifier: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedPreferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: { language },
      create: {
        userId: user.id,
        language: language || 'en', // Default to 'en' if not provided
      },
    });

    return NextResponse.json(updatedPreferences, { status: 200 });
  } catch (error) {
    console.error('Failed to update user preferences:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
