import { EnhancedCategorizer } from '../index';
import { TEST_DATASETS } from './testData';

describe('EnhancedCategorizer', () => {
  let categorizer: EnhancedCategorizer;

  beforeEach(() => {
    categorizer = new EnhancedCategorizer();
  });

  describe('Basic categorization', () => {
    it('should categorize basic items correctly', async () => {
      for (const testCase of TEST_DATASETS.basic) {
        const result = await categorizer.categorizeItem(testCase.item, testCase.storeType);
        expect(result.category).toBe(testCase.expected);
        expect(result.confidence).toBeGreaterThanOrEqual(testCase.confidence);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle edge cases correctly', async () => {
      for (const testCase of TEST_DATASETS.edge_cases) {
        const result = await categorizer.categorizeItem(testCase.item, testCase.storeType);
        expect(result.category).toBe(testCase.expected);
      }
    });
  });

  describe('Multilingual support', () => {
    it('should categorize multilingual items', async () => {
      for (const testCase of TEST_DATASETS.multilingual) {
        const result = await categorizer.categorizeItem(testCase.item, testCase.storeType);
        expect(result.category).toBe(testCase.expected);
      }
    });
  });

  describe('Typo handling', () => {
    it('should handle typos with fuzzy matching', async () => {
      for (const testCase of TEST_DATASETS.typos) {
        const result = await categorizer.categorizeItem(testCase.item, testCase.storeType);
        expect(result.category).toBe(testCase.expected);
      }
    });
  });

  describe('Learning system', () => {
    it('should learn from user corrections', async () => {
      const item = 'растительное молоко';
      const initialResult = await categorizer.categorizeItem(item, 'lidl');
      categorizer.learnFromUser(item, initialResult.category, 'Beverages', 'lidl');
      const correctedResult = await categorizer.categorizeItem(item, 'lidl');
      expect(correctedResult.category).toBe('Beverages');
    });
  });

  describe('Store-specific behavior', () => {
    it('should return correct category order for different stores', async () => {
      const result = await categorizer.categorizeItem('яблоки', 'lidl');
      expect(result.categoryOrder).toBeDefined();
      expect(result.icon).toBeDefined();
    });
  });
});
