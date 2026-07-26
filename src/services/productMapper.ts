import type { Product } from "../types/product";
import type { ProductAnalysis } from "../types/ProductAnalysis";
import type { ProductProfile } from "../data/productDatabase";

/**
 * Converts AI analysis into ZipList's canonical Product model.
 */
export function mapAIAnalysisToProduct(
  analysis: ProductAnalysis
): Product {
  return {
    name: analysis.model
      ? `${analysis.brand ?? ""} ${analysis.model}`.trim()
      : analysis.brand ?? "Unknown Product",

    brand: analysis.brand,

    model: analysis.model,

    category: analysis.category,

    subcategory: null,

    specifications: analysis.keyFeatures,

    retail: {
      low: null,
      high: null,
    },

    searchKeywords: analysis.searchKeywords,
  };
}

/**
 * Converts a local database match into ZipList's canonical Product model.
 */
export function mapDatabaseProductToProduct(
  profile: ProductProfile
): Product {
  return {
    name: profile.keywords[0] ?? "Unknown Product",

    brand: null,

    model: null,

    category: profile.category,

    subcategory: null,

    specifications: profile.specs,

    retail: {
      low: null,
      high: null,
    },

    searchKeywords: profile.keywords,
  };
}