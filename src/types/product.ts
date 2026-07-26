/**
 * ZipList's canonical representation of a product.
 *
 * Every product intelligence source (local database, AI, barcode lookup,
 * image recognition, etc.) should eventually map into this type.
 */
export interface Product {
  /**
   * Best known product name.
   * Example: "Milwaukee M18 Hammer Drill"
   */
  name: string;

  /**
   * Manufacturer or brand.
   * Null when unknown.
   */
  brand: string | null;

  /**
   * Model number or identifier.
   * Null when unknown.
   */
  model: string | null;

  /**
   * Marketplace category.
   * Example: "Tools"
   */
  category: string;

  /**
   * Optional subcategory.
   * Example: "Power Tools"
   */
  subcategory: string | null;

  /**
   * Known specifications or features.
   */
  specifications: string[];

  /**
   * Estimated retail value range.
   * Null when unknown.
   */
  retail: {
    low: number | null;
    high: number | null;
  };

  /**
   * Search terms useful for price research
   * and marketplace searches.
   */
  searchKeywords: string[];
}