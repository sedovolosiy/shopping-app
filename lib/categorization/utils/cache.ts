import { LRUCache } from 'lru-cache';
import { CategorizationResult } from '../types';

export class CategorizationCache {
  private cache: LRUCache<string, CategorizationResult>;
  private hitCount = 0;
  private missCount = 0;

  constructor(maxSize: number = 1000) {
    this.cache = new LRUCache({ max: maxSize });
  }

  get(key: string): CategorizationResult | undefined {
    const result = this.cache.get(key);
    if (result) this.hitCount++;
    else this.missCount++;
    return result;
  }

  set(key: string, value: CategorizationResult): void {
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: this.hitCount / (this.hitCount + this.missCount) || 0
    };
  }

  generateKey(item: string, storeType: string, language?: string): string {
    return `${item.toLowerCase()}|${storeType}|${language || 'auto'}`;
  }
}

export const categorizationCache = new CategorizationCache();
