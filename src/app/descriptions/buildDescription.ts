import { baseItemTitle } from "../../detection/baseItemTitle";
import type {
  FormData,
  SaleOutcome,
  ToneTag,
  VariantId,
} from "../../types/listing";
import { parseAskingPrice } from "../../utils/money";
import {
  cleanText,
  ensureSentence,
} from "../../utils/textHelpers";
import {
  conditionSentence,
  itemWords,
  pronounConditionSentence,
  shortCondition,
} from "./conditionSentence";
import {
  conditionWithDetailsOrDefault,
  defaultDetailSentence,
} from "./defaultDetaiSentence";
import { valuePitch } from "./valuePitch";

function hasTone(form: FormData, tone: ToneTag): boolean {
  return form.toneTags.includes(tone);
}

function seriousOffersLine(hasSellerPrice: boolean): string {
  return hasSellerPrice
    ? "Price is firm. Serious offers only, please."
    : "Serious offers only, please.";
}

function hasSellerEnteredPrice(form: FormData): boolean {
  return parseAskingPrice(form.askingPrice) !== null;
}

function outcomeLabel(outcome: SaleOutcome): string {
  if (outcome === "sellFast") return "Sell Fast";
  if (outcome === "mostProfit") return "Most Profit";

  return "Balanced";
}

function outcomeClosing(
  outcome: SaleOutcome,
  hasSellerPrice: boolean,
): string {
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

function variantClosing(
  form: FormData,
  variant: VariantId,
): string {
  const hasSellerPrice = hasSellerEnteredPrice(form);

  if (variant === "fast") {
    return "Priced to sell. Message me if interested.";
  }

  if (variant === "value") {
    return seriousOffersLine(hasSellerPrice);
  }

  if (variant === "honest") {
    return "Message me if interested.";
  }

  return outcomeClosing(form.saleOutcome, hasSellerPrice);
}

export function buildDescription(
  form: FormData,
  category: string,
  variant: VariantId,
  price: string,
): string {
  const item = baseItemTitle(form);
  const words = itemWords(item);
  const sellerDetails = cleanText(form.details);
  const detailSentence = ensureSentence(sellerDetails);
  const hasDetails = detailSentence.length > 0;
  const fallbackDetails = defaultDetailSentence(
    item,
    category,
    form.condition,
  );
  const conditionLine = conditionSentence(item, form.condition);
  const pronounConditionLine = pronounConditionSentence(
    item,
    form.condition,
  );
  const closing = ensureSentence(variantClosing(form, variant));
  const sellerPrice = parseAskingPrice(form.askingPrice);
  const hasSellerPrice = sellerPrice !== null;
  const valueClosing = seriousOffersLine(hasSellerPrice);

  const isShort = hasTone(form, "Short");
  const isSimple = hasTone(form, "Simple");
  const isDetailed = hasTone(form, "Detailed");
  const isFriendly = hasTone(form, "Friendly");
  const isProfessional = hasTone(form, "Professional");
  const isCasual = hasTone(form, "Casual");
  const isTrustworthy = hasTone(form, "Trustworthy");
  const isConfident = hasTone(form, "Confident");

  const noToneSelected = form.toneTags.length === 0;

  if (form.condition === "Needs Repair") {
    if (variant === "fast") {
      return `${item}. Needs repair. Priced to sell as-is, so message me if interested.`;
    }

    if (variant === "value") {
      const priceLine = hasSellerPrice
        ? `Asking ${price} for it as-is. ${seriousOffersLine(true)}`
        : `Asking ${price} for it as-is. ${seriousOffersLine(false)}`;

      return `Repair project: ${item}

Condition: Needs repair

Details: ${hasDetails ? detailSentence : fallbackDetails}

Best fit: Someone comfortable with repairs, troubleshooting, or using it for parts.

${priceLine}`;
    }

    if (variant === "honest") {
      return `${conditionLine} ${
        hasDetails ? detailSentence : fallbackDetails
      } Message me if interested.`;
    }

    return `${conditionLine} ${
      hasDetails ? detailSentence : fallbackDetails
    } ${closing}`;
  }

  if (variant === "fast") {
    if (isShort || isSimple) {
      return `${item}. ${shortCondition(
        form.condition,
      )}. Good deal. Priced to sell. Message me if interested.`;
    }

    if (isProfessional) {
      return `${conditionLine} ${
        hasDetails ? detailSentence : fallbackDetails
      } Priced for a faster sale, so message me if interested.`;
    }

    if (isFriendly || isCasual) {
      return `Good deal on ${words.casualReference}. ${pronounConditionLine} ${
        hasDetails ? detailSentence : fallbackDetails
      } Priced to sell, so grab ${words.objectPronoun} while ${
        words.availablePhrase
      }.`;
    }

    return `Good deal on ${words.casualReference}. ${pronounConditionLine} ${
      hasDetails ? detailSentence : fallbackDetails
    } Priced to sell, so message me if interested.`;
  }

  if (variant === "value") {
    const priceIntro = hasSellerPrice
      ? `I'm asking ${price}.`
      : `Asking ${price}.`;

    if (isShort || isSimple) {
      return `${priceIntro} ${valuePitch(
        item,
        category,
      )} ${conditionWithDetailsOrDefault(
        item,
        category,
        form.condition,
        sellerDetails,
      )} ${valueClosing}`;
    }

    if (isDetailed || isTrustworthy) {
      return `${priceIntro}

${valuePitch(item, category)}

Condition: ${shortCondition(form.condition)}.

Details: ${hasDetails ? detailSentence : fallbackDetails}

${valueClosing}`;
    }

    return `${priceIntro} ${valuePitch(
      item,
      category,
    )} ${conditionWithDetailsOrDefault(
      item,
      category,
      form.condition,
      sellerDetails,
    )} ${valueClosing}`;
  }

  if (variant === "honest") {
    if (isShort || isSimple) {
      return `${item}. ${shortCondition(form.condition)}. ${
        hasDetails ? detailSentence : fallbackDetails
      } Message me if interested.`;
    }

    if (isDetailed || isTrustworthy) {
      return `Selling ${item}.

Condition: ${shortCondition(form.condition)}.

Details: ${hasDetails ? detailSentence : fallbackDetails}

Message me if interested.`;
    }

    return `${conditionLine} ${
      hasDetails ? detailSentence : fallbackDetails
    } Message me if interested.`;
  }

  if (isShort) {
    return `${item}. ${shortCondition(form.condition)}. ${
      hasDetails ? detailSentence : fallbackDetails
    } ${closing}`;
  }

  if (isCasual && isSimple) {
    return `${item}. ${shortCondition(form.condition)}. ${
      hasDetails ? detailSentence : fallbackDetails
    } ${closing}`;
  }

  if (isFriendly && isProfessional) {
    return `${conditionLine} ${
      hasDetails ? detailSentence : fallbackDetails
    } ${closing}`;
  }

  if (isProfessional && isDetailed) {
    return `This listing is for ${item}.

Condition: ${shortCondition(form.condition)}.

Details: ${hasDetails ? detailSentence : fallbackDetails}

${closing}`;
  }

  if (isTrustworthy && isDetailed) {
    return `This listing is for ${item}.

Condition: ${shortCondition(form.condition)}.

Known details: ${hasDetails ? detailSentence : fallbackDetails}

${closing}`;
  }

  if (isDetailed) {
    return `Listing: ${item}

Condition: ${shortCondition(form.condition)}

Details: ${hasDetails ? detailSentence : fallbackDetails}

Sale goal: ${outcomeLabel(form.saleOutcome)}

${closing}`;
  }

  if (isProfessional && isTrustworthy) {
    return `${conditionLine} ${
      hasDetails ? detailSentence : fallbackDetails
    } ${closing}`;
  }

  if (isFriendly && isTrustworthy) {
    return `${conditionLine} ${
      hasDetails ? detailSentence : fallbackDetails
    } ${closing}`;
  }

  if (isProfessional) {
    return `${conditionLine} ${
      hasDetails ? detailSentence : fallbackDetails
    } ${closing}`;
  }

  if (isFriendly) {
    return `${conditionLine} ${
      hasDetails ? detailSentence : fallbackDetails
    } ${closing}`;
  }

  if (isCasual) {
    return `Selling ${words.casualReference}. ${shortCondition(
      form.condition,
    )}. ${hasDetails ? detailSentence : fallbackDetails} ${closing}`;
  }

  if (isConfident) {
    return `${conditionLine} ${valuePitch(item, category)} ${
      hasDetails ? detailSentence : fallbackDetails
    } ${closing}`;
  }

  if (isSimple || noToneSelected) {
    return `${conditionLine} ${
      hasDetails ? detailSentence : fallbackDetails
    } ${closing}`;
  }

  return `${conditionLine} ${
    hasDetails ? detailSentence : fallbackDetails
  } ${closing}`;
}