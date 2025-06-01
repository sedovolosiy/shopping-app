// app/api/shopping-list/route.ts
import { NextResponse } from 'next/server';
import { shoppingListCreateSchema, shoppingListGetSchema, shoppingListDeleteSchema } from './schemas/validation';
import { ShoppingListService } from './services/shoppingListService';
import { UserService } from './services/userService';

const shoppingListService = new ShoppingListService();
const userService = new UserService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = shoppingListCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: 'Invalid input', details: validation.error.format() }, { status: 400 });
    }
    const { rawText, userId, listName, storeId } = validation.data;
    const user = await userService.findOrCreate(userId);
    const result = await shoppingListService.createOrUpdate({ rawText, userId: user.id, listName, storeId });
    return NextResponse.json(result, { status: result.metadata.action === 'created' ? 201 : 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const validation = shoppingListGetSchema.safeParse({ userId });
    if (!validation.success) {
      return NextResponse.json({ success: false, message: 'Invalid input', details: validation.error.format() }, { status: 400 });
    }
    const user = await userService.findOrCreate(validation.data.userId);
    const shoppingLists = await shoppingListService.getAllForUser(user.id);
    return NextResponse.json(shoppingLists, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get('listId');
    const userId = searchParams.get('userId');
    const validation = shoppingListDeleteSchema.safeParse({ listId, userId });
    if (!validation.success) {
      return NextResponse.json({ success: false, message: 'Invalid input', details: validation.error.format() }, { status: 400 });
    }
    const result = await shoppingListService.deleteList(listId!, userId!);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to delete shopping list', error: error.message }, { status: 500 });
  }
}
