export function parseAskingPrice(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const number = Number(cleaned);

  if (!cleaned || !Number.isFinite(number) || number <= 0) {
    return null;
  }

  return number;
}

export function formatExactMoney(value: number) {
  if (Number.isInteger(value)) return `$${value}`;
  return `$${value.toFixed(2)}`;
}

export function roundToFive(value: number) {
  return Math.max(5, Math.round(value / 5) * 5);
}

export function money(value: number) {
  return `$${roundToFive(value)}`;
}