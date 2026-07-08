export function cleanText(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

export function ensureSentence(text: string) {
  const cleaned = cleanText(text);

  if (!cleaned) return "";

  if (
    cleaned.endsWith(".") ||
    cleaned.endsWith("!") ||
    cleaned.endsWith("?")
  ) {
    return cleaned;
  }

  return `${cleaned}.`;
}

export function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}