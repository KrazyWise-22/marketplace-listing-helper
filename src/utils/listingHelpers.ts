import type {
  SaleOutcome,
  ToneTag,
} from "../types/listing";

export function toneText(toneTags: ToneTag[]): string {
  return toneTags.length > 0
    ? toneTags.join(" + ")
    : "Neutral default";
}

export function outcomeLabel(
  outcome: SaleOutcome,
): string {
  if (outcome === "sellFast") return "Sell Fast";
  if (outcome === "mostProfit") return "Most Profit";

  return "Balanced";
}

export function defaultVariantIndex(
  outcome: SaleOutcome,
): number {
  if (outcome === "sellFast") return 1;
  if (outcome === "mostProfit") return 2;

  return 0;
}