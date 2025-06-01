import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Поиск пользователя по identifier (email или id)
    let user = await prisma.user.findUnique({
      where: { identifier: userId },
    });

    // Если не найден — создаём
    if (!user) {
      user = await prisma.user.create({
        data: { identifier: userId },
      });
    }

    return NextResponse.json({ userId: user.identifier });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
