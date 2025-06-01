// Zod validation schemas for shopping list API
import { z } from 'zod';

export const shoppingListCreateSchema = z.object({
  rawText: z.string().min(1, 'Raw text cannot be empty'),
  userId: z.string().min(1, 'User ID cannot be empty'),
  listName: z.string().optional(),
  storeId: z.string().optional(),
});

export const shoppingListGetSchema = z.object({
  userId: z.string().min(1, 'User ID cannot be empty'),
});

export const shoppingListDeleteSchema = z.object({
  listId: z.string().min(1, 'List ID cannot be empty'),
  userId: z.string().min(1, 'User ID cannot be empty'),
});
