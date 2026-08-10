import type {
  ListingVariant,
  ToneTag,
} from "../types/listing";

import { toneText } from "../utils/listingHelpers";

interface ListingDetailsProps {
  selectedListing: ListingVariant;
  condition: string;
  toneTags: ToneTag[];
}

export function ListingDetails({
  selectedListing,
  condition,
  toneTags,
}: ListingDetailsProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-black/30 sm:p-6">
      <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
        Listing Details
      </p>

      <h3 className="mt-3 text-2xl font-bold leading-tight text-white">
        {selectedListing.title}
      </h3>

      <p className="mt-2 text-4xl font-black text-white">
        {selectedListing.price}
      </p>

      <div className="mt-5 grid gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:grid-cols-2">
        <p className="text-sm text-slate-400">
          <span className="font-semibold text-slate-200">Category:</span>{" "}
          {selectedListing.category}
        </p>

        <p className="text-sm text-slate-400">
          <span className="font-semibold text-slate-200">Condition:</span>{" "}
          {condition || "Not specified"}
        </p>

        <p className="text-sm text-slate-400">
          <span className="font-semibold text-slate-200">Price source:</span>{" "}
          {selectedListing.priceSource}
        </p>

        <p className="text-sm text-slate-400">
          <span className="font-semibold text-slate-200">Tone:</span>{" "}
          {toneText(toneTags)}
        </p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-base font-bold text-slate-200">Description</p>

        <div className="min-h-44 rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="whitespace-pre-line text-base leading-7 text-slate-300">
            {selectedListing.description}
          </p>
        </div>
      </div>
    </section>
  );
}
