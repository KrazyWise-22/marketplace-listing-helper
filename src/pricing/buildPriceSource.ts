import type { FormData, VariantId } from "../types/listing";
import { parseAskingPrice } from "../utils/money";

export function buildPriceSource(
  form: FormData,
  variant: VariantId,
): string {
  const sellerPrice = parseAskingPrice(form.askingPrice);

  if (sellerPrice !== null) {
    if (variant === "fast") {
      return "Seller price adjusted for faster sale";
    }

    if (variant === "value") {
      return "Seller price adjusted for higher value";
    }

    return "Seller-entered price";
  }

  return "ZipList estimate";
}