import { ensureSentence } from "../../utils/textHelpers";
import {
  conditionSentence,
  itemWords,
} from "./conditionSentence";

export function defaultDetailSentence(
  item: string,
  category: string,
  condition: string,
): string {
  const words = itemWords(item);

  if (condition === "Needs Repair") {
    return `Best for someone comfortable fixing ${words.objectPronoun} or using ${words.objectPronoun} for parts.`;
  }

  if (category === "Electronics") {
    return `${words.pronoun} ${words.beVerb} ready for the next owner.`;
  }

  if (category === "Baby / Kids") {
    return `${words.pronoun} ${words.beVerb} ready for another family to use.`;
  }

  if (category === "Furniture") {
    return `${words.pronoun} ${words.beVerb} a practical piece with plenty of use left.`;
  }

  if (category === "Tools") {
    return `${words.pronoun} ${words.beVerb} ready to use for your next project.`;
  }

  if (category === "Clothing") {
    return `${words.pronoun} ${words.beVerb} ready for the next owner.`;
  }

  if (category === "Toys") {
    return `${words.pronoun} ${words.beVerb} ready for someone else to enjoy.`;
  }

  return `${words.pronoun} ${words.beVerb} available now and ready for the next owner.`;
}

export function conditionWithDetailsOrDefault(
  item: string,
  category: string,
  condition: string,
  details: string,
): string {
  const sellerDetails = ensureSentence(details);

  if (sellerDetails) {
    return `${conditionSentence(item, condition)} ${sellerDetails}`;
  }

  return `${conditionSentence(
    item,
    condition,
  )} ${defaultDetailSentence(item, category, condition)}`;
}