// app/api/stores/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(stores, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

const createStoreSchema = z.object({
  name: z.string().min(1, 'Store name cannot be empty'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createStoreSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 });
    }

    const { name } = validation.data;

    // Check if store already exists
    const existingStore = await prisma.store.findUnique({
      where: { name },
    });

    if (existingStore) {
      return NextResponse.json({ error: 'Store with this name already exists' }, { status: 409 });
    }

    const newStore = await prisma.store.create({
      data: {
        name,
      },
    });

    return NextResponse.json(newStore, { status: 201 });
  } catch (error) {
    console.error('Failed to create store:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
