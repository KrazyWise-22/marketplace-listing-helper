function parseSellerPriceValue(raw: string | null): number | null {
  if (!raw) return null;
  const parsed = Number(raw.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function buildPriceSource(form: FormData, variant: "fast" | "value") {
  const askingPriceEntry = form.get("askingPrice");
  const sellerPrice = parseSellerPriceValue(
    typeof askingPriceEntry === "string" ? askingPriceEntry : null
  );

  if (sellerPrice !== null) {
    if (variant === "fast") return "Seller price adjusted for faster sale";
    if (variant === "value") return "Seller price adjusted for higher value";

    return "Seller-entered price";
  }

  return "ZipList estimate";
}