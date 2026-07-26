async function buildPrice(form: FormData, category: string, variant: VariantId) {
  const sellerPrice = parseAskingPrice(form.askingPrice);

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

const base = guessBasePrice(form.itemName, category);

const conditionAdjusted =
  base * conditionMultiplier(form.condition);

const outcomeAdjusted =
  conditionAdjusted * outcomeMultiplier(form.saleOutcome);

if (variant === "fast") return money(outcomeAdjusted * 0.9);
if (variant === "value") return money(outcomeAdjusted * 1.12);
if (variant === "honest") return money(outcomeAdjusted);

return money(outcomeAdjusted);
}

export function buildPriceSource(form: FormData, variant: VariantId) {
  const sellerPrice = parseAskingPrice(form.askingPrice);

  if (sellerPrice !== null) {
    if (variant === "fast") return "Seller price adjusted for faster sale";
    if (variant === "value") return "Seller price adjusted for higher value";

    return "Seller-entered price";
  }

  return "ZipList estimate";
}