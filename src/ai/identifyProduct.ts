import type { FormData } from "../types/listing";

import { findProduct } from "../data/productDatabase";

export async function identifyProduct(form: FormData) {
  const localProduct = findProduct(form.itemName);

  if (localProduct) {
    return localProduct;
  }

  return null;
}