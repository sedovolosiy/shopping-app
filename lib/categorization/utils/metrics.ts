export interface CategorizationMetrics {
  totalCategorizations: number;
  categoryDistribution: { [category: string]: number };
  averageConfidence: number;
  languageDistribution: { [language: string]: number };
  storeDistribution: { [store: string]: number };
  lowConfidenceItems: Array<{
    item: string;
    category: string;
    confidence: number;
    timestamp: Date;
  }>;
}

export class MetricsCollector {
  private metrics: CategorizationMetrics = {
    totalCategorizations: 0,
    categoryDistribution: {},
    averageConfidence: 0,
    languageDistribution: {},
    storeDistribution: {},
    lowConfidenceItems: []
  };

  trackCategorization(
    item: string,
    category: string,
    confidence: number,
    language: string,
    storeType: string
  ): void {
    this.metrics.totalCategorizations++;
    if (!this.metrics.categoryDistribution[category]) this.metrics.categoryDistribution[category] = 0;
    this.metrics.categoryDistribution[category]++;
    if (!this.metrics.languageDistribution[language]) this.metrics.languageDistribution[language] = 0;
    this.metrics.languageDistribution[language]++;
    if (!this.metrics.storeDistribution[storeType]) this.metrics.storeDistribution[storeType] = 0;
    this.metrics.storeDistribution[storeType]++;
    const totalConfidence = this.metrics.averageConfidence * (this.metrics.totalCategorizations - 1) + confidence;
    this.metrics.averageConfidence = totalConfidence / this.metrics.totalCategorizations;
    if (confidence < 0.5) {
      this.metrics.lowConfidenceItems.push({
        item,
        category,
        confidence,
        timestamp: new Date()
      });
      if (this.metrics.lowConfidenceItems.length > 100) {
        this.metrics.lowConfidenceItems = this.metrics.lowConfidenceItems.slice(-100);
      }
    }
  }

  getMetrics(): CategorizationMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      totalCategorizations: 0,
      categoryDistribution: {},
      averageConfidence: 0,
      languageDistribution: {},
      storeDistribution: {},
      lowConfidenceItems: []
    };
  }
}

export const metricsCollector = new MetricsCollector();
