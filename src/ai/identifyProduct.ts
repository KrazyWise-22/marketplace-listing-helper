import { findProduct } from "../data/productDatabase";

export function identifyProduct(itemName: string) {
  return findProduct(itemName);
}