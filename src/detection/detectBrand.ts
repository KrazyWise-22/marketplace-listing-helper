export function cleanText(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

export function addBrandToItemName(itemName: string, brand: string) {
  const cleanItem = cleanText(itemName);
  const cleanBrand = cleanText(brand);

  if (!cleanItem || !cleanBrand) return cleanItem;

  if (cleanItem.toLowerCase().startsWith(cleanBrand.toLowerCase())) {
    return cleanItem;
  }

  return `${cleanBrand} ${cleanItem}`;
}

export function detectBrand(itemName: string) {
  const text = itemName.toLowerCase();

  if (
    text.includes("iphone") ||
    text.includes("ipad") ||
    text.includes("macbook") ||
    text.includes("apple watch")
  ) {
    return "Apple";
  }

  if (text.includes("galaxy") || text.includes("samsung")) return "Samsung";
  if (text.includes("ps5") || text.includes("playstation")) return "Sony";
  if (text.includes("xbox")) return "Microsoft";
  if (text.includes("switch")) return "Nintendo";
  if (text.includes("nike")) return "Nike";
  if (text.includes("dewalt")) return "DeWalt";
  if (text.includes("milwaukee")) return "Milwaukee";
  if (text.includes("ryobi")) return "Ryobi";
  if (text.includes("skil")) return "SKIL";
  if (text.includes("craftsman")) return "Craftsman";
  if (text.includes("pioneer")) return "Pioneer";
  if (text.includes("sony")) return "Sony";
  if (text.includes("bose")) return "Bose";
  if (text.includes("jbl")) return "JBL";
  if (text.includes("babybond")) return "BabyBond";
  if (text.includes("graco")) return "Graco";

  if (
    text.includes("fisher price") ||
    text.includes("fisher-price")
  ) {
    return "Fisher-Price";
  }

  if (
    text.includes("hp laptop") ||
    text.includes("hp ")
  ) {
    return "HP";
  }

  if (text.includes("dell")) return "Dell";
  if (text.includes("lenovo")) return "Lenovo";

  return "";
}