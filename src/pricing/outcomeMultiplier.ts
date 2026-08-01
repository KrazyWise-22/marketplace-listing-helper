type SaleOutcome = "sellFast" | "mostProfit" | string;

export function outcomeMultiplier(outcome: SaleOutcome) {
  if (outcome === "sellFast") return 0.85;
  if (outcome === "mostProfit") return 1.18;
  return 1;
}