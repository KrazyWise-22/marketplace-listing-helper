import { itemWords } from "./conditionSentence";

export function valuePitch(
  item: string,
  category: string,
): string {
  const words = itemWords(item);
  const lowerItem = item.toLowerCase();

  if (
    category === "Electronics" &&
    lowerItem.includes("speaker")
  ) {
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