import type { FormData } from "../types/listing";

export function buildTitle(
  form: FormData,
  category: string
) {
  const item = form.itemName.trim();

  if (!item) {
    return "";
  }

  if (
    category &&
    !item.toLowerCase().includes(category.toLowerCase())
  ) {
    return `${item} - ${category}`;
  }

  return item;
}