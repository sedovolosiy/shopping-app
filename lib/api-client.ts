/**
 * API client for shopping optimizer
 */

import { ShoppingItem } from './types';

// Types for API responses
export interface ShoppingListResponse {
  success: boolean;
  message: string;
  items: ShoppingItem[];
  metadata: {
    totalItems: number;
    userId: string;
    listName: string;
    storeName: string;
    processedWith: 'ai' | 'local';
  }
}

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
  suggestion?: string;
}

/**
 * Process a shopping list using the API
 * @param rawText - The raw text of the shopping list
 * @param userId - The user ID 
 * @param listName - Optional name for the shopping list
 * @param storeId - Optional store ID for layout optimization
 */
export async function processShoppingListWithAPI(
  rawText: string,
  userId: string,
  listName?: string,
  storeId?: string
): Promise<ShoppingListResponse> {
  const response = await fetch('/api/shopping-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rawText,
      userId,
      listName,
      storeId
    }),
  });

  if (!response.ok) {
    const errorData = await response.json() as ErrorResponse;
    throw new Error(errorData.message || errorData.error || 'Failed to process shopping list');
  }

  return await response.json() as ShoppingListResponse;
}

/**
 * Get store list from API
 */
export async function getStores() {
  const response = await fetch('/api/stores');
  
  if (!response.ok) {
    const errorData = await response.json() as ErrorResponse;
    throw new Error(errorData.message || errorData.error || 'Failed to fetch stores');
  }
  
  return await response.json();
}

/**
 * Add a new store
 * @param name - Store name
 */
export async function addStore(name: string) {
  const response = await fetch('/api/stores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  
  if (!response.ok) {
    const errorData = await response.json() as ErrorResponse;
    throw new Error(errorData.message || errorData.error || 'Failed to add store');
  }
  
  return await response.json();
}
