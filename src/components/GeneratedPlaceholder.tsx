export function GeneratedPlaceholder() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center shadow-2xl shadow-black/30">
      <p className="text-xl font-black text-white">
        Your listing will appear here
      </p>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        Add what you are selling, choose the item condition, pick your sale
        goal, then click Generate Listing.
      </p>

      <div className="mt-5 grid gap-3 text-left sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
            Step 1
          </p>
          <p className="mt-1 text-sm font-bold text-slate-200">
            Add item info
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Name, category, photos, and helpful details.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
            Step 2
          </p>
          <p className="mt-1 text-sm font-bold text-slate-200">
            Choose sale goal
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Sell fast, balanced, or most profit.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
            Step 3
          </p>
          <p className="mt-1 text-sm font-bold text-slate-200">
            Generate
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            ZipList writes the listing for you.
          </p>
        </div>
      </div>
    </div>
  );
}