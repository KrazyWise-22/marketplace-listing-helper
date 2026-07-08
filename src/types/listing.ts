export type SaleOutcome = "sellFast" | "balanced" | "mostProfit";

export type MobileView = "input" | "result";

export type ToneTag =
  | "Friendly"
  | "Professional"
  | "Simple"
  | "Detailed"
  | "Confident"
  | "Casual"
  | "Trustworthy"
  | "Short";

export type VariantId =
  | "placeholder"
  | "recommended"
  | "fast"
  | "value"
  | "honest";

export interface FormData {
  itemName: string;
  condition: string;
  categoryOverride: string;
  saleOutcome: SaleOutcome;
  askingPrice: string;
  toneTags: ToneTag[];
  details: string;
}

export interface ListingVariant {
  id: VariantId;
  label: string;
  note: string;
  title: string;
  price: string;
  priceSource: string;
  category: string;
  description: string;
  strategy: string;
  copyText: string;
}

export interface ListingOutput {
  selectedVariantIndex: number;
  variants: ListingVariant[];
}

export interface PhotoPreview {
  id: string;
  url: string;
  name: string;
}