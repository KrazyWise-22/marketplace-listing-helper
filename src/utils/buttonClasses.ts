import type { SaleOutcome } from "../types/listing";

export function toneButtonClass(selected: boolean): string {
  return selected
    ? "border-emerald-400 bg-emerald-400 text-black shadow-[0_0_0_1px_rgba(52,211,153,0.25)]"
    : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500";
}

export function outcomeButtonClass(
  selectedOutcome: SaleOutcome,
  buttonOutcome: SaleOutcome,
): string {
  return selectedOutcome === buttonOutcome
    ? "border-emerald-400 bg-slate-800 text-white shadow-[0_0_0_1px_rgba(52,211,153,0.2)]"
    : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500";
}

export function variantButtonClass(
  selectedVariantIndex: number,
  index: number,
): string {
  return selectedVariantIndex === index
    ? "border-emerald-400 bg-slate-800 shadow-[0_0_0_1px_rgba(52,211,153,0.2)]"
    : "border-slate-800 bg-slate-950 hover:border-slate-600";
}