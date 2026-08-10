/* eslint-disable @next/next/no-img-element -- Local object URL previews are not optimized by next/image. */

import type {
  ListingVariant,
  PhotoPreview,
} from "../types/listing";

interface MarketplacePreviewProps {
  selectedListing: ListingVariant;
  condition: string;
  photoPreviews: PhotoPreview[];
}

export function MarketplacePreview({
  selectedListing,
  condition,
  photoPreviews,
}: MarketplacePreviewProps) {
  const primaryPhoto = photoPreviews[0];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/30">
      <div className="border-b border-slate-800 p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
          Marketplace Preview
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Final buyer-facing preview before copying.
        </p>
      </div>

      <div className="relative flex h-72 items-center justify-center overflow-hidden bg-linear-to-br from-slate-800 via-slate-700 to-slate-900 sm:h-80">
        {primaryPhoto ? (
          <img
            src={primaryPhoto.url}
            alt={primaryPhoto.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-600 bg-slate-800/60 text-3xl">
              📷
            </div>
            <span className="text-base">No photo added yet</span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-black/10" />

        <div className="absolute left-4 top-4 rounded-full bg-black/75 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow">
          Preview
        </div>

        {photoPreviews.length > 1 && (
          <div className="absolute right-4 top-4 rounded-full bg-black/75 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow">
            {photoPreviews.length} photos
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="text-4xl font-black leading-tight text-white drop-shadow">
            {selectedListing.price}
          </p>
          <p className="mt-2 text-lg font-bold text-white drop-shadow">
            {selectedListing.title}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        {photoPreviews.length > 1 && (
          <div>
            <p className="mb-2 text-sm font-bold text-slate-200">Photos</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {photoPreviews.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden rounded-lg border border-slate-800 bg-slate-900"
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-full w-full object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute inset-x-1 bottom-1 rounded bg-black/75 py-1 text-center text-[10px] font-bold uppercase text-white">
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <p className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-400">
            <span className="font-semibold text-slate-200">Condition:</span>{" "}
            {condition || "Not specified"}
          </p>

          <p className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-400">
            <span className="font-semibold text-slate-200">Category:</span>{" "}
            {selectedListing.category}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-slate-200">Description</p>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="whitespace-pre-line text-sm leading-6 text-slate-300">
              {selectedListing.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
