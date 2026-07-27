export function baseItemTitle(form: FormData) {
  const itemName = cleanText(form.itemName);
  const brand = detectBrand(itemName);

  if (!itemName) return "Untitled Listing";
  if (brand) return addBrandToItemName(itemName, brand);

  return itemName;
}

export function buildTitle(
  form: FormData,
  category: string,
  variant: "recommended" | "fast" | "value" | "honest",
) {
  const item = baseItemTitle(form);
  const condition = conditionPhrase(form.condition);
  const benefit = categoryBenefit(category, form.condition);
  const valuePhrase = valueTitlePhrase(item, category);

  if (form.condition === "Needs Repair") {
    if (variant === "fast") return `${item} – Needs Repair, Priced to Move`;
    if (variant === "value") return `${item} – Repair Project`;
    return `${item} – Needs Repair`;
  }

  if (variant === "fast") {
    return `${item} – Priced to Sell`;
  }

  if (variant === "value") {
    if (condition) return `${item} – ${condition}, ${valuePhrase}`;
    return `${item} – ${valuePhrase}`;
  }

  if (variant === "honest") {
    if (condition) return `${item} – ${condition}`;
    return `${item} – ${benefit}`;
  }

  if (form.saleOutcome === "sellFast") {
    return `${item} – ${benefit}`;
  }

  if (form.saleOutcome === "mostProfit") {
    if (condition) return `${item} – ${condition}, ${valuePhrase}`;
    return `${item} – ${valuePhrase}`;
  }

  if (condition) return `${item} – ${condition}`;
  return `${item} – ${benefit}`;
}

export function categoryBenefit(category: string, condition: string) {
  if (condition === "Needs Repair") return "Repair Project";
  if (category === "Electronics") return "Ready to Use";
  if (category === "Baby / Kids") return "Ready for Use";
  if (category === "Furniture") return "Practical Piece";
  if (category === "Tools") return "Ready to Use";
  if (category === "Clothing") return "Ready to Wear";
  if (category === "Toys") return "Ready to Enjoy";

  return "Ready for Pickup";
}

export function conditionPhrase(condition: string) {
  if (condition === "New") return "Brand New";
  if (condition === "Like New") return "Like New";
  if (condition === "Good") return "Good Condition";
  if (condition === "Fair") return "Fair Condition";
  if (condition === "Needs Repair") return "Needs Repair";

  return "";
}

export function valueTitlePhrase(item: string, category: string) {
  const text = item.toLowerCase();

  if (category === "Electronics" && text.includes("speaker")) {
    return "Audio Gear";
  }

  if (category === "Baby / Kids") return "Useful Baby Item";
  if (category === "Electronics") return "Ready to Use";
  if (category === "Furniture") return "Solid Piece";
  if (category === "Tools") return "Ready to Use";
  if (category === "Clothing") return "Clean and Ready";
  if (category === "Toys") return "Ready to Enjoy";

  return "Worth Considering";
}