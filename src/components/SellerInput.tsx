/* eslint-disable @next/next/no-img-element -- Local object URL previews are not optimized by next/image. */

import {
  listingCategories,
  maxPhotoCount,
  toneOptions,
} from "../constants/app";

import type {
  FormData,
  MobileView,
  PhotoPreview,
  SaleOutcome,
  ToneTag,
} from "../types/listing";

import {
  outcomeButtonClass,
  toneButtonClass,
} from "../utils/buttonClasses";

type UpdateField = <K extends keyof FormData>(
  field: K,
  value: FormData[K],
) => void;

interface SellerInputProps {
  form: FormData;
  formNotice: string;
  photoPreviews: PhotoPreview[];
  isGenerating: boolean;
  mobileView: MobileView;
  onUpdateField: UpdateField;
  onAddTone: (tone: ToneTag) => void;
  onRemoveTone: (tone: ToneTag) => void;
  onPhotoUpload: (files: FileList | null) => void;
  onRemovePhoto: (photoId: string) => void;
  onGenerate: () => void | Promise<void>;
  onReset: () => void;
}

export function SellerInput({
  form,
  formNotice,
  photoPreviews,
  isGenerating,
  mobileView,
  onUpdateField,
  onAddTone,
  onRemoveTone,
  onPhotoUpload,
  onRemovePhoto,
  onGenerate,
  onReset,
}: SellerInputProps) {
  const availableTones = toneOptions.filter(
    (tone) => !form.toneTags.includes(tone),
  );

  const hasPhotos = photoPreviews.length > 0;
  const photoSlotsRemaining = maxPhotoCount - photoPreviews.length;

  return (
    <div
      className={`${
        mobileView === "result" ? "hidden lg:block" : "block"
      } space-y-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-black/20 sm:p-6`}
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Seller Input</h2>
        <p className="mt-1 text-sm text-slate-400">
          Answer the seller-side questions. ZipList handles the wording.
        </p>
      </div>

      {formNotice && (
        <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm font-medium leading-6 text-amber-200">
          {formNotice}
        </div>
      )}

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-300">
            1. What are you selling?
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add the item name, category, and photos if you have them.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Item name <span className="text-emerald-300">*</span>
          </label>
          <input
            placeholder="Example: iPhone 12, dresser, baby swing"
            value={form.itemName}
            onChange={(event) => onUpdateField("itemName", event.target.value)}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-base outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Category
          </label>
          <p className="mb-3 text-sm leading-6 text-slate-500">
            Leave this on auto unless ZipList guesses wrong.
          </p>
          <select
            value={form.categoryOverride}
            onChange={(event) =>
              onUpdateField("categoryOverride", event.target.value)
            }
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-base outline-none transition focus:border-emerald-400"
          >
            <option value="">Auto-detect category</option>
            {listingCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Photos
          </label>
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-200">
                  {photoPreviews.length} of {maxPhotoCount} photos added
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  The first photo becomes the main preview.
                </p>
              </div>

              <label
                className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-xl px-5 text-sm font-black transition active:scale-[0.99] ${
                  photoSlotsRemaining <= 0
                    ? "cursor-not-allowed bg-slate-700 text-slate-300"
                    : "bg-emerald-400 text-black hover:bg-emerald-300"
                }`}
              >
                {hasPhotos ? "Add More Photos" : "Add Photos"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={photoSlotsRemaining <= 0}
                  onChange={(event) => {
                    onPhotoUpload(event.target.files);
                    event.target.value = "";
                  }}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {photoPreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photoPreviews.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-bold text-white">
                    {index === 0 ? "Main" : index + 1}
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemovePhoto(photo.id)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-sm font-black text-white transition hover:bg-red-500"
                    aria-label={`Remove ${photo.name}`}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-300">
            2. Item condition
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Helps ZipList keep the listing honest and clear.
          </p>
        </div>

        <select
          value={form.condition}
          onChange={(event) => onUpdateField("condition", event.target.value)}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-base outline-none transition focus:border-emerald-400"
        >
          <option value="">Select condition</option>
          <option>New</option>
          <option>Like New</option>
          <option>Good</option>
          <option>Fair</option>
          <option>Needs Repair</option>
        </select>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-300">
            3. Desired outcome of sale
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Choose whether you want a faster sale, a fair middle ground, or a
            stronger asking price.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold text-slate-200">
            Sell speed / price priority
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                ["sellFast", "Sell Fast", "Faster, easier sale"],
                ["balanced", "Balanced", "Fair middle ground"],
                ["mostProfit", "Most Profit", "Stronger asking price"],
              ] as Array<[SaleOutcome, string, string]>
            ).map(([outcome, label, note]) => (
              <button
                key={outcome}
                type="button"
                onClick={() => onUpdateField("saleOutcome", outcome)}
                className={`rounded-xl border p-4 text-left transition ${outcomeButtonClass(
                  form.saleOutcome,
                  outcome,
                )}`}
              >
                <p className="font-black">{label}</p>
                <p className="mt-1 text-xs text-slate-400">{note}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            Optional asking price
          </label>

          <p className="mb-3 text-sm leading-6 text-slate-200">
            Already know what you want for it? Enter that price here. If left
            blank, ZipList will estimate one.
          </p>

          <input
            placeholder="Example: 300"
            inputMode="decimal"
            value={form.askingPrice}
            onChange={(event) =>
              onUpdateField("askingPrice", event.target.value)
            }
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-300">
            4. Desired tone of listing
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Pick one or two tones. Selected tones move into their own space.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold text-slate-200">
            Available tones
          </p>

          <div className="flex flex-wrap gap-2">
            {availableTones.map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => onAddTone(tone)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${toneButtonClass(
                  false,
                )}`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-slate-200">Selected tone</p>
            <p className="text-xs text-slate-500">Click one to remove it</p>
          </div>

          {form.toneTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {form.toneTags.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => onRemoveTone(tone)}
                  className="rounded-full border border-emerald-400 bg-emerald-400 px-3 py-1.5 text-xs font-bold text-black transition hover:bg-emerald-300"
                >
                  {tone} ×
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-700 bg-slate-950 p-3 text-sm text-slate-500">
              No tone selected. ZipList will use a neutral default tone.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-300">
            Helpful details
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Optional, but useful for flaws, accessories, pickup notes, or
            measurements.
          </p>
        </div>

        <textarea
          placeholder="Example: small scratch on side, charger included, pickup only, smoke-free home..."
          value={form.details}
          onChange={(event) => onUpdateField("details", event.target.value)}
          rows={5}
          className="min-h-32 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base leading-6 outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
        />
      </section>

      <div className="flex flex-col items-center gap-3 pt-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className={`h-14 w-full max-w-md rounded-xl text-lg font-black text-black transition active:scale-[0.99] ${
            isGenerating
              ? "cursor-not-allowed bg-emerald-300 opacity-80"
              : "bg-emerald-400 hover:bg-emerald-300"
          }`}
        >
          {isGenerating ? "Generating..." : "Generate Listing"}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="h-10 w-36 rounded-xl border border-slate-600 text-sm font-semibold transition hover:bg-slate-800 active:scale-[0.99]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
