import type {
  ListingVariant,
  SaleOutcome,
} from "../types/listing";

import { variantButtonClass } from "../utils/buttonClasses";
import { outcomeLabel } from "../utils/listingHelpers";

interface ListingStrategyProps {
  saleOutcome: SaleOutcome;
  selectedListing: ListingVariant;
  variants: ListingVariant[];
  selectedVariantIndex: number;
  isGenerating: boolean;
  hasGeneratedListing: boolean;
  onSelectVariant: (index: number) => void;
}

export function ListingStrategy({
  saleOutcome,
  selectedListing,
  variants,
  selectedVariantIndex,
  isGenerating,
  hasGeneratedListing,
  onSelectVariant,
}: ListingStrategyProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-black/30 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
            Listing Strategy
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Seller goal:{" "}
            <span className="font-semibold text-slate-200">
              {outcomeLabel(saleOutcome)}
            </span>
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Selected version:{" "}
            <span className="font-semibold text-slate-200">
              {selectedListing.label}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
        <p className="text-sm font-bold text-emerald-300">
          Why ZipList chose this
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {selectedListing.strategy}
        </p>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-base font-bold text-slate-200">
            Choose listing version
          </p>
          <p className="text-sm text-slate-500">Optional strategy change</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {variants.map((variant, index) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelectVariant(index)}
              disabled={isGenerating || !hasGeneratedListing}
              className={`rounded-xl border p-4 text-left transition ${variantButtonClass(
                selectedVariantIndex,
                index,
              )}`}
            >
              <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
                {variant.label}
              </p>
              <p className="mt-1 text-xs text-slate-500">{variant.note}</p>
              <p className="mt-3 text-sm font-bold leading-5 text-white">
                {variant.title}
              </p>
              <p className="mt-2 text-lg font-black text-white">
                {variant.price}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
