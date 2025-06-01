import { prisma } from '@/lib/db';
import { processShoppingList } from './aiService';

// Shopping list business logic service

export class ShoppingListService {
  async createOrUpdate({ rawText, userId, listName, storeId }: { rawText: string, userId: string, listName?: string, storeId?: string }) {
    const processedItems = await processShoppingList(rawText);
    const finalListName = listName || 'My Shopping List';
    const existingList = await prisma.shoppingList.findFirst({
      where: { userId, name: finalListName },
      include: { items: true, store: true },
    });
    let shoppingList;
    if (existingList) {
      await prisma.shoppingListItem.deleteMany({ where: { shoppingListId: existingList.id } });
      shoppingList = await prisma.shoppingList.update({
        where: { id: existingList.id },
        data: {
          rawText,
          ...(storeId ? { storeId } : {}),
          updatedAt: new Date(),
          items: {
            create: processedItems.map(item => ({
              originalText: item.originalText,
              normalizedText: item.normalizedText,
              category: item.category,
              quantity: item.quantity,
              unit: item.unit,
              language: item.language,
              name: item.normalizedText,
              categoryOrder: 0,
            })),
          },
        },
        include: { items: true, store: true },
      });
    } else {
      shoppingList = await prisma.shoppingList.create({
        data: {
          name: finalListName,
          rawText,
          ...(storeId ? { storeId } : {}),
          userId,
          items: {
            create: processedItems.map(item => ({
              originalText: item.originalText,
              normalizedText: item.normalizedText,
              category: item.category,
              quantity: item.quantity,
              unit: item.unit,
              language: item.language,
              name: item.normalizedText,
              categoryOrder: 0,
            })),
          },
        },
        include: { items: true, store: true },
      });
    }
    let storeName = 'Unknown Store';
    if (shoppingList.store && shoppingList.store.name) {
      storeName = shoppingList.store.name;
    } else if (storeId) {
      const store = await prisma.store.findUnique({ where: { id: storeId } });
      if (store) storeName = store.name;
    }
    return {
      success: true,
      message: existingList ? 'Shopping list updated successfully' : 'Shopping list created successfully',
      items: shoppingList.items,
      metadata: {
        totalItems: shoppingList.items.length,
        userId: shoppingList.userId || 'unknown',
        listName: shoppingList.name,
        storeName,
        processedWith: 'ai',
        action: existingList ? 'updated' : 'created',
      },
    };
  }

  async getAllForUser(userId: string) {
    const shoppingLists = await prisma.shoppingList.findMany({
      where: { userId },
      include: { items: true, store: true },
      orderBy: { createdAt: 'desc' },
    });
    return shoppingLists;
  }

  async deleteList(listId: string, userId: string) {
    const user = await prisma.user.findUnique({ where: { identifier: userId } });
    if (!user) return { success: false, error: 'User not found', status: 404 };
    const list = await prisma.shoppingList.findFirst({
      where: { id: listId, userId: user.id },
      include: { items: true },
    });
    if (!list) return { success: false, error: 'Shopping list not found or access denied', status: 404 };
    await prisma.shoppingListItem.deleteMany({ where: { shoppingListId: listId } });
    const deletedList = await prisma.shoppingList.delete({ where: { id: listId } });
    return {
      success: true,
      message: 'Shopping list deleted successfully',
      data: deletedList,
      metadata: {
        listId,
        userId,
        name: list.name,
        itemCount: list.items.length,
        action: 'deleted',
      },
      status: 200,
    };
  }
}
