export function baseItemTitle(form: FormData) {
  const itemName = cleanText(form.itemName);
  const brand = detectBrand(itemName);

  if (!itemName) return "Untitled Listing";
  if (brand) return addBrandToItemName(itemName, brand);

  return itemName;
}

export function buildCopyText(
  title: string,
  price: string,
  condition: string,
  category: string,
  description: string,
) {
  return `${title}

Price: ${price}
Condition: ${condition || "Not specified"}
Category: ${category}

${description}`;
}

export function buildDescription(
  form: FormData,
  category: string,
  variant: VariantId,
  price: string,
) {
  const item = baseItemTitle(form);
  const words = itemWords(item);
  const sellerDetails = cleanText(form.details);
  const detailSentence = ensureSentence(sellerDetails);
  const hasDetails = detailSentence.length > 0;
  const fallbackDetails = defaultDetailSentence(item, category, form.condition);
  const conditionLine = conditionSentence(item, form.condition);
  const pronounConditionLine = pronounConditionSentence(item, form.condition);
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

export function conditionDescription(condition: string) {
  if (condition === "New") return "brand new";
  if (condition === "Like New") return "like-new";
  if (condition === "Good") return "good";
  if (condition === "Fair") return "fair";
  if (condition === "Needs Repair") return "needs repair";

  return "usable";
}

export function conditionSentence(item: string, condition: string) {
  const words = itemWords(item);

  if (condition === "New") {
    return `${words.subject} ${words.beVerb} brand new.`;
  }

  if (condition === "Needs Repair") {
    return `${words.subject} ${words.needVerb} repair.`;
  }

  return `${words.subject} ${words.beVerb} in ${conditionDescription(
    condition,
  )} condition.`;
}

export function conditionWithDetailsOrDefault(
  item: string,
  category: string,
  condition: string,
  details: string,
) {
  const sellerDetails = ensureSentence(details);

  if (sellerDetails) {
    return `${conditionSentence(item, condition)} ${sellerDetails}`;
  }

  if (condition === "Needs Repair") {
    return `${conditionSentence(item, condition)} ${defaultDetailSentence(
      item,
      category,
      condition,
    )}`;
  }

  if (category === "Electronics") {
    return `${conditionSentence(item, condition)} ${defaultDetailSentence(
      item,
      category,
      condition,
    )}`;
  }

  if (category === "Baby / Kids") {
    return `${conditionSentence(item, condition)} ${defaultDetailSentence(
      item,
      category,
      condition,
    )}`;
  }

  return `${conditionSentence(item, condition)} ${defaultDetailSentence(
    item,
    category,
    condition,
  )}`;
}

export function defaultDetailSentence(item: string, category: string, condition: string) {
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

export function hasSellerEnteredPrice(form: FormData) {
  return parseAskingPrice(form.askingPrice) !== null;
}

export function hasTone(form: FormData, tone: ToneTag) {
  return form.toneTags.includes(tone);
}

export function isPluralItem(item: string) {
  const text = item.toLowerCase();

  return (
    text.includes("speakers") ||
    text.includes("headphones") ||
    text.includes("shoes") ||
    text.includes("boots") ||
    text.includes("pants") ||
    text.endsWith("s")
  );
}

export function itemWords(item: string) {
  const plural = isPluralItem(item);

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

export function outcomeClosing(outcome: SaleOutcome, hasSellerPrice: boolean) {
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

export function outcomeLabel(outcome: SaleOutcome) {
  if (outcome === "sellFast") return "Sell Fast";
  if (outcome === "mostProfit") return "Most Profit";
  return "Balanced";
}

export function pronounConditionSentence(item: string, condition: string) {
  const words = itemWords(item);

  if (condition === "New") {
    return `${words.pronoun} ${words.beVerb} brand new.`;
  }

  if (condition === "Needs Repair") {
    return `${words.pronoun} ${words.needVerb} repair.`;
  }

  return `${words.pronoun} ${words.beVerb} in ${conditionDescription(
    condition,
  )} condition.`;
}

export function seriousOffersLine(hasSellerPrice: boolean) {
  return hasSellerPrice
    ? "Price is firm. Serious offers only, please."
    : "Serious offers only, please.";
}

export function shortCondition(condition: string) {
  if (condition === "New") return "Brand new";
  if (condition === "Like New") return "Like new";
  if (condition === "Good") return "Good condition";
  if (condition === "Fair") return "Fair condition";
  if (condition === "Needs Repair") return "Needs repair";

  return "Available now";
}

export function valuePitch(item: string, category: string) {
  const words = itemWords(item);
  const lowerItem = item.toLowerCase();

  if (category === "Electronics" && lowerItem.includes("speaker")) {
    return `${words.subject} ${words.beVerb} a solid audio upgrade for someone looking for dependable sound without buying new.`;
  }

  if (category === "Baby / Kids") {
    return `${words.subject} ${words.beVerb} a practical baby item for someone looking to save money compared with buying new.`;
  }

  if (category === "Electronics") {
    return `${words.subject} ${words.beVerb} a solid option for someone looking for a dependable device without buying new.`;
  }

  if (category === "Furniture") {
    return `${words.subject} ${words.beVerb} a practical furniture upgrade with plenty of use left.`;
  }

  if (category === "Tools") {
    return `${words.subject} ${words.beVerb} a dependable option for someone who needs a useful tool without paying full retail.`;
  }

  if (category === "Clothing") {
    return `${words.subject} ${words.beVerb} a good everyday option for the right person.`;
  }

  return `${words.subject} ${words.beVerb} a solid option for someone looking for this type of item.`;
}

export function variantClosing(form: FormData, variant: VariantId) {
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