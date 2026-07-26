interface ProductInfo {
  retailRange?: string;
}

async function identifyProduct(_form: FormData): Promise<ProductInfo | null> {
  return null;
}

type VariantId = "fast" | "value" | "honest";

function parseAskingPriceValue(rawPrice: unknown): number | null {
  if (rawPrice === null || rawPrice === undefined) return null;

  const normalized = typeof rawPrice === "string" ? rawPrice.trim() : rawPrice;
  if (normalized === "") return null;

  const parsed =
    typeof normalized === "number"
      ? normalized
        : Number(String(normalized).replace(/[^\\n\d.-]+/g, ""));

  return Number.isFinite(parsed) ? parsed : null;
}

function formatExactMoney(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function money(amount: number) {
  return formatExactMoney(amount);
}

async function buildPrice(form: FormData, category: string, variant: VariantId) {
  const sellerPrice = parseAskingPriceValue(form.get("askingPrice"));

  if (sellerPrice !== null) {
    if (variant === "fast") return money(sellerPrice * 0.9);
    if (variant === "value") return money(sellerPrice * 1.08);

    return formatExactMoney(sellerPrice);
  }

  const productInfo = await identifyProduct(form);

  if (productInfo && "retailRange" in productInfo && productInfo.retailRange) {
    const matches = productInfo.retailRange.match(/\$(\d+)-\$(\d+)/);

    if (matches) {
      const low = Number(matches[1]);
      const high = Number(matches[2]);

      if (variant === "fast") {
        return money(low * 0.9);
      }

      if (variant === "value") {
        return money(high);
      }

      return money(low);
    }
  }

  const itemName = form.get("itemName");
  const condition = form.get("condition");
  const saleOutcome = form.get("saleOutcome");

  const base = guessBasePrice(String(itemName ?? ""), category);

  const conditionAdjusted =
    base * conditionMultiplier(String(condition ?? ""));

  const outcomeAdjusted =
    conditionAdjusted * outcomeMultiplier(String(saleOutcome ?? ""));

  if (variant === "fast") return money(outcomeAdjusted * 0.9);
  if (variant === "value") return money(outcomeAdjusted * 1.12);
  if (variant === "honest") return money(outcomeAdjusted);

  return money(outcomeAdjusted);
}