import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { itemId, purchased } = body;
    
    if (!itemId || typeof purchased !== 'boolean') {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing itemId or invalid purchased value' 
      }, { status: 400 });
    }
    
    // Update the item's purchased status
    const updatedItem = await prisma.shoppingListItem.update({
      where: { id: itemId },
      data: { purchased },
    });
    
    return NextResponse.json({ 
      success: true, 
      item: updatedItem 
    }, { status: 200 });
  } catch (error: any) {
    console.error('❌ PATCH item error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update item', 
      error: error.message 
    }, { status: 500 });
  }
}
