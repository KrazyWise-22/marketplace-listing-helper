import type { FormData } from "../types/listing";
import type { VariantId } from "../types/listing";

import { cleanText, ensureSentence } from "../utils/textHelpers";
import { parseAskingPrice } from "../utils/money";
import { baseItemTitle } from "../detection/baseItemTitle";

function hasTone(form: FormData, tone: string) {
  return form.toneTags.includes(tone as never);
}

function hasSellerEnteredPrice(form: FormData) {
  return parseAskingPrice(form.askingPrice) !== null;
}

function seriousOffersLine(hasSellerPrice: boolean) {
  return hasSellerPrice
    ? "Price is firm. Serious offers only, please."
    : "Serious offers only, please.";
}

function itemWords(item: string) {
  const text = item.toLowerCase();

  const plural =
    text.includes("speakers") ||
    text.includes("headphones") ||
    text.includes("shoes") ||
    text.includes("boots") ||
    text.includes("pants") ||
    text.endsWith("s");

  return {
    subject: plural ? `These ${item}` : `This ${item}`,
    casualReference: plural ? `these ${item}` : `this ${item}`,
    pronoun: plural ? "They" : "It",
    objectPronoun: plural ? "them" : "it",
    beVerb: plural ? "are" : "is",
    workVerb: plural ? "work" : "works",
    needVerb: plural ? "need" : "needs",
    availablePhrase: plural ? "they’re available" : "it’s available",
  };
}

function conditionDescription(condition: string) {
  if (condition === "New") return "brand new";
  if (condition === "Like New") return "like-new";
  if (condition === "Good") return "good";
  if (condition === "Fair") return "fair";
  if (condition === "Needs Repair") return "needs repair";
  return "usable";
}

function shortCondition(condition: string) {
  if (condition === "New") return "Brand new";
  if (condition === "Like New") return "Like new";
  if (condition === "Good") return "Good condition";
  if (condition === "Fair") return "Fair condition";
  if (condition === "Needs Repair") return "Needs repair";
  return "Available now";
}

function conditionSentence(item: string, condition: string) {
  const words = itemWords(item);

  if (condition === "New") return `${words.subject} ${words.beVerb} brand new.`;
  if (condition === "Needs Repair") return `${words.subject} ${words.needVerb} repair.`;

  return `${words.subject} ${words.beVerb} in ${conditionDescription(condition)} condition.`;
}

function pronounConditionSentence(item: string, condition: string) {
  const words = itemWords(item);

  if (condition === "New") return `${words.pronoun} ${words.beVerb} brand new.`;
  if (condition === "Needs Repair") return `${words.pronoun} ${words.needVerb} repair.`;

  return `${words.pronoun} ${words.beVerb} in ${conditionDescription(condition)} condition.`;
}

function defaultDetailSentence(item: string, category: string, condition: string) {
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

function conditionWithDetailsOrDefault(
  item: string,
  category: string,
  condition: string,
  details: string,
) {
  const sellerDetails = ensureSentence(details);

  if (sellerDetails) {
    return `${conditionSentence(item, condition)} ${sellerDetails}`;
  }

  return `${conditionSentence(item, condition)} ${defaultDetailSentence(
    item,
    category,
    condition,
  )}`;
}

function outcomeClosing(outcome: string, hasSellerPrice: boolean) {
  if (outcome === "sellFast") {
    return "Priced with a quick sale in mind. Message me if interested.";
  }

  if (outcome === "mostProfit") {
    return seriousOffersLine(hasSellerPrice);
  }

  return hasSellerPrice
    ? "Message me if interested. Serious offers only, please."
    : "Message me if interested. Reasonable offers considered.";
}

function variantClosing(form: FormData, variant: VariantId) {
  const hasSellerPrice = hasSellerEnteredPrice(form);

  if (variant === "fast") return "Priced to sell. Message me if interested.";
  if (variant === "value") return seriousOffersLine(hasSellerPrice);
  if (variant === "honest") return "Message me if interested.";

  return outcomeClosing(form.saleOutcome, hasSellerPrice);
}

function valuePitch(item: string, category: string) {
  const words = itemWords(item);

  if (category === "Tools") {
    return `${words.subject} ${words.beVerb} a dependable option for someone who needs a useful tool without paying full retail.`;
  }

  return `${words.subject} ${words.beVerb} a solid option for someone looking for this type of item.`;
}

export function buildDescription(
  form: FormData,
  category: string,
  variant: VariantId,
  price: string,
) {
  // KEEP THE ENTIRE BODY OF YOUR EXISTING buildDescription()
  // PASTE IT HERE UNCHANGED.
}