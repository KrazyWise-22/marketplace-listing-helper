import { FormData } from "../types/listing";
import {
  addBrandToItemName,
  cleanText,
  detectBrand,
} from "./detectBrand";

export function baseItemTitle(form: FormData) {
  const itemName = cleanText(form.itemName);
  const brand = detectBrand(itemName);

  if (!itemName) return "Untitled Listing";

  if (brand) {
    return addBrandToItemName(itemName, brand);
  }

  return itemName;
}