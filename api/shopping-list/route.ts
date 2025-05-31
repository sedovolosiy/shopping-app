// app/api/shopping-list/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';

// Placeholder for AI processing function
async function processItemsWithAI(items: string[]): Promise<Array<{ originalText: string; normalizedText: string; category: string; quantity: string; unit: string; language: string }>> {
  // In a real application, this function would call an AI service
  // to normalize text, categorize, extract quantity/unit, and detect language.
  // For now, we'll use a mock implementation.
  console.log('AI Processing (mock):', items);
  return items.map(item => ({
    originalText: item,
    normalizedText: item.trim(), // Simple normalization
    category: 'Uncategorized', // Mock category
    quantity: '1', // Mock quantity
    unit: 'unit', // Mock unit
    language: 'en', // Mock language detection
  }));
}

const shoppingListCreateSchema = z.object({
  rawText: z.string().min(1, 'Raw text cannot be empty'),
  userId: z.string().min(1, 'User ID cannot be empty'), // Or some other user identifier
  listName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = shoppingListCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 });
    }

    const { rawText, userId, listName } = validation.data;

    // 1. Find or create the user
    // For simplicity, we're using a basic identifier. In a real app, this would be more robust.
    let user = await prisma.user.findUnique({
      where: { identifier: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          identifier: userId,
          preferences: {
            create: { language: 'en' }, // Default language
          },
        },
      });
    }

    // 2. Parse rawText into individual items
    // This basic parsing splits by newline. More sophisticated parsing can be added.
    const itemTexts = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    if (itemTexts.length === 0) {
      return NextResponse.json({ error: 'No items provided in the list' }, { status: 400 });
    }

    // 3. Process items with AI (mocked for now)
    const processedItems = await processItemsWithAI(itemTexts);

    // 4. Create the ShoppingList and its ListItems
    const shoppingList = await prisma.shoppingList.create({
      data: {
        name: listName,
        rawInput: rawText,
        userId: user.id,
        items: {
          create: processedItems.map(item => ({
            originalText: item.originalText,
            normalizedText: item.normalizedText,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            language: item.language,
          })),
        },
      },
      include: {
        items: true, // Include items in the response
      },
    });

    return NextResponse.json(shoppingList, { status: 201 });
  } catch (error) {
    console.error('Failed to create shopping list:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

const shoppingListGetSchema = z.object({
  userId: z.string().min(1, 'User ID cannot be empty'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const validation = shoppingListGetSchema.safeParse({ userId });
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: { identifier: validation.data.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const shoppingLists = await prisma.shoppingList.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(shoppingLists, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch shopping lists:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
