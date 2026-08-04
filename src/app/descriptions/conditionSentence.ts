export interface ItemWords {
  subject: string;
  casualReference: string;
  pronoun: string;
  objectPronoun: string;
  beVerb: string;
  workVerb: string;
  needVerb: string;
  availablePhrase: string;
}

function isPluralItem(item: string): boolean {
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

export function itemWords(item: string): ItemWords {
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

function conditionDescription(condition: string): string {
  if (condition === "New") return "brand new";
  if (condition === "Like New") return "like-new";
  if (condition === "Good") return "good";
  if (condition === "Fair") return "fair";
  if (condition === "Needs Repair") return "needs repair";

  return "usable";
}

export function shortCondition(condition: string): string {
  if (condition === "New") return "Brand new";
  if (condition === "Like New") return "Like new";
  if (condition === "Good") return "Good condition";
  if (condition === "Fair") return "Fair condition";
  if (condition === "Needs Repair") return "Needs repair";

  return "Available now";
}

export function conditionSentence(
  item: string,
  condition: string,
): string {
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

export function pronounConditionSentence(
  item: string,
  condition: string,
): string {
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