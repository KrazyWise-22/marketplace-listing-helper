export interface ProductAnalysis {
  /**
   * The best human-readable name for the product.
   * Example:
   * "Milwaukee M18 Brushless Hammer Drill"
   */
  productName: string;

  /**
   * Manufacturer or brand.
   * Example:
   * "Milwaukee"
   */
  brand: string | null;

  /**
   * Model number if known.
   * Example:
   * "2904-20"
   */
  model: string | null;

  /**
   * General marketplace category.
   * Example:
   * "Power Tools"
   */
  category: string;

  /**
   * How confident the AI is that the identification is correct.
   * 0.0–1.0
   */
  confidence: number;

  /**
   * Important product characteristics.
   */
  keyFeatures: string[];

  /**
   * Things the seller should provide that are still unknown.
   */
  missingInformation: string[];

  /**
   * Search terms useful for pricing, research, and marketplaces.
   */
  searchKeywords: string[];

  /**
   * Brief explanation of why the AI reached this conclusion.
   */
  reasoning: string;
}