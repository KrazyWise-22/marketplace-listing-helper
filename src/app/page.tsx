"use client";

/* eslint-disable @next/next/no-img-element -- Local object URL previews are not optimized by next/image. */

import { useState } from "react";

import type {
  FormData,
  ListingOutput,
  MobileView,
  PhotoPreview,
  SaleOutcome,
  ToneTag,
} from "../types/listing";

import { buildDescription } from "./descriptions/buildDescription";
import { buildListingVariants } from "../listings/buildListingVariants";
import { cleanText } from "../utils/textHelpers";

type VariantId = "placeholder" | "recommended" | "fast" | "value" | "honest";

const maxPhotoCount = 20;

const emptyForm: FormData = {
  itemName: "",
  condition: "",
  categoryOverride: "",
  saleOutcome: "balanced",
  askingPrice: "",
  toneTags: [],
  details: "",
};

const emptyListing: ListingOutput = {
  selectedVariantIndex: 0,
  variants: [
    {
      id: "placeholder",
      label: "Recommended Listing",
      note: "ZipList will choose the best version after generating.",
      title: "Your generated title will appear here",
      price: "—",
      priceSource: "Waiting for input",
      category: "Category auto-detected",
      description: "Your generated description will appear here.",
      strategy: "Waiting for item details.",
      copyText: `Your generated title will appear here

Price: —
Condition: Not specified
Category: Category auto-detected

Your generated description will appear here.`,
    },
  ],
};

const toneOptions: ToneTag[] = [
  "Friendly",
  "Professional",
  "Simple",
  "Detailed",
  "Confident",
  "Casual",
  "Trustworthy",
  "Short",
];

const feedbackFormUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSdWytfydGV7Z8VcR0BEvTmsmhpEdwlFyWZxbR7iGhq_kGAmtA/viewform?usp=publish-editor";

const listingCategories = [
  "Electronics",
  "Baby / Kids",
  "Furniture",
  "Tools",
  "Clothing",
  "Toys",
  "Home / Kitchen",
  "Sports / Outdoors",
  "General",
];

function toneText(toneTags: ToneTag[]) {
  return toneTags.length > 0 ? toneTags.join(" + ") : "Neutral default";
}

function outcomeLabel(outcome: SaleOutcome) {
  if (outcome === "sellFast") return "Sell Fast";
  if (outcome === "mostProfit") return "Most Profit";
  return "Balanced";
}

function defaultVariantIndex(outcome: SaleOutcome) {
  if (outcome === "sellFast") return 1;
  if (outcome === "mostProfit") return 2;
  return 0;
}

export default function Home() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [listing, setListing] = useState<ListingOutput>(emptyListing);
  const [photoPreviews, setPhotoPreviews] = useState<PhotoPreview[]>([]);
  const [copied, setCopied] = useState(false);
  const [formNotice, setFormNotice] = useState("");
  const [resultNotice, setResultNotice] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>("input");

  const selectedListing =
    listing.variants[listing.selectedVariantIndex] || listing.variants[0];

  const availableTones = toneOptions.filter(
    (tone) => !form.toneTags.includes(tone),
  );

  const hasItemName = cleanText(form.itemName).length > 0;
  const hasCondition = cleanText(form.condition).length > 0;
  const hasGeneratedListing = selectedListing.id !== "placeholder";
  const primaryPhoto = photoPreviews[0];
  const hasPhotos = photoPreviews.length > 0;
  const photoSlotsRemaining = maxPhotoCount - photoPreviews.length;

  function scrollToPageTop() {
    if (typeof window === "undefined") return;

    window.setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  }

  function switchMobileView(nextView: MobileView) {
    setMobileView(nextView);
    scrollToPageTop();
  }

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "itemName" && typeof value === "string" && cleanText(value)) {
      setFormNotice("");
    }

    if (field === "condition" && typeof value === "string" && cleanText(value)) {
      setFormNotice("");
    }
  }

  function addTone(tone: ToneTag) {
    setForm((prev) => {
      if (prev.toneTags.includes(tone)) return prev;

      if (prev.toneTags.length >= 2) {
        setFormNotice(
          "You can use up to two tones. Remove one selected tone before adding another.",
        );

        return prev;
      }

      setFormNotice("");

      return {
        ...prev,
        toneTags: [...prev.toneTags, tone],
      };
    });
  }

  function removeTone(tone: ToneTag) {
    setForm((prev) => ({
      ...prev,
      toneTags: prev.toneTags.filter((item) => item !== tone),
    }));

    setFormNotice("");
  }

  function handlePhotoUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    const remainingSlots = photoSlotsRemaining;

    if (remainingSlots <= 0) {
      setFormNotice(`You can add up to ${maxPhotoCount} photos.`);
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remainingSlots);
    const nextPhotos = selectedFiles.map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setPhotoPreviews((prev) => [...prev, ...nextPhotos]);

    if (files.length > remainingSlots) {
      setFormNotice(
        `Added ${remainingSlots} photos. ZipList supports up to ${maxPhotoCount} photos for now.`,
      );
      return;
    }

    if (!hasItemName) {
      setFormNotice(
        `${
          nextPhotos.length === 1 ? "Photo added" : "Photos added"
        }. Add an item name so ZipList can generate a real listing.`,
      );
      return;
    }

    setFormNotice("");
  }

  function removePhoto(photoId: string) {
    setPhotoPreviews((prev) => {
      const removedPhoto = prev.find((photo) => photo.id === photoId);

      if (removedPhoto) {
        URL.revokeObjectURL(removedPhoto.url);
      }

      return prev.filter((photo) => photo.id !== photoId);
    });
  }

  async function handleGenerate() {
    setCopied(false);
    setResultNotice("");

    if (!hasItemName) {
      if (hasPhotos) {
        setFormNotice(
          "Photo added. Add an item name so ZipList can generate a real listing.",
        );
      } else {
        setFormNotice(
          "Add an item name first so ZipList has something real to build from.",
        );
      }

      return;
    }

    if (!hasCondition) {
      setFormNotice(
        "Choose the item condition so the listing stays honest and useful.",
      );
      return;
    }

    setIsGenerating(true);
    setFormNotice("");

    try {
      const variants = await buildListingVariants(form, {
        buildDescription,
        outcomeLabel,
        toneText,
      });

      setListing({
        selectedVariantIndex: defaultVariantIndex(form.saleOutcome),
        variants,
      });

      switchMobileView("result");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSelectVariant(index: number) {
    if (!hasGeneratedListing) return;

    setListing((prev) => ({
      ...prev,
      selectedVariantIndex: index,
    }));

    setCopied(false);
    setResultNotice("");
  }

  function handleReset() {
    photoPreviews.forEach((photo) => URL.revokeObjectURL(photo.url));
    setForm(emptyForm);
    setListing(emptyListing);
    setPhotoPreviews([]);
    setCopied(false);
    setFormNotice("");
    setResultNotice("");
    setIsGenerating(false);
    switchMobileView("input");
  }

  async function handleCopy() {
    if (!hasGeneratedListing) {
      setFormNotice("Generate a listing first, then you can copy it.");
      return;
    }

    try {
      await navigator.clipboard.writeText(selectedListing.copyText);
      setCopied(true);
      setResultNotice("");

      setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch {
      setCopied(false);
      setResultNotice(
        "Copy did not work in this browser. You can still select and copy the listing text from the description above.",
      );
    }
  }

  function toneButtonClass(selected: boolean) {
    return selected
      ? "border-emerald-400 bg-emerald-400 text-black shadow-[0_0_0_1px_rgba(52,211,153,0.25)]"
      : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500";
  }

  function outcomeButtonClass(outcome: SaleOutcome) {
    return form.saleOutcome === outcome
      ? "border-emerald-400 bg-slate-800 text-white shadow-[0_0_0_1px_rgba(52,211,153,0.2)]"
      : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500";
  }

  function variantButtonClass(index: number) {
    return listing.selectedVariantIndex === index
      ? "border-emerald-400 bg-slate-800 shadow-[0_0_0_1px_rgba(52,211,153,0.2)]"
      : "border-slate-800 bg-slate-950 hover:border-slate-600";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <header className="mb-10 text-center sm:mb-12">
          <p className="mb-3 text-5xl font-black tracking-tight text-emerald-400 sm:text-6xl">
            ZipList
          </p>

          <p className="text-base font-medium text-slate-200 sm:text-lg">
            Tell ZipList what you are selling. It builds the listing for you.
          </p>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Item name, photos, condition, seller goal, tone — then a copy-ready
            marketplace listing.
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Built for speed, clarity, and honest local selling.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div
            className={`${
              mobileView === "result" ? "hidden lg:block" : "block"
            } space-y-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-black/20 sm:p-6`}
          >
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Seller Input
              </h2>
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
                  onChange={(event) =>
                    updateField("itemName", event.target.value)
                  }
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
                    updateField("categoryOverride", event.target.value)
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
                          handlePhotoUpload(event.target.files);
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
                          onClick={() => removePhoto(photo.id)}
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
                onChange={(event) =>
                  updateField("condition", event.target.value)
                }
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
                  Choose whether you want a faster sale, a fair middle ground,
                  or a stronger asking price.
                </p>
              </div>

              <div>
                <p className="mb-3 text-sm font-bold text-slate-200">
                  Sell speed / price priority
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => updateField("saleOutcome", "sellFast")}
                    className={`rounded-xl border p-4 text-left transition ${outcomeButtonClass(
                      "sellFast",
                    )}`}
                  >
                    <p className="font-black">Sell Fast</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Faster, easier sale
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField("saleOutcome", "balanced")}
                    className={`rounded-xl border p-4 text-left transition ${outcomeButtonClass(
                      "balanced",
                    )}`}
                  >
                    <p className="font-black">Balanced</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Fair middle ground
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField("saleOutcome", "mostProfit")}
                    className={`rounded-xl border p-4 text-left transition ${outcomeButtonClass(
                      "mostProfit",
                    )}`}
                  >
                    <p className="font-black">Most Profit</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Stronger asking price
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Optional asking price
                </label>

                <p className="mb-3 text-sm leading-6 text-slate-200">
                  Already know what you want for it? Enter that price here. If
                  left blank, ZipList will estimate one.
                </p>

                <input
                  placeholder="Example: 300"
                  inputMode="decimal"
                  value={form.askingPrice}
                  onChange={(event) =>
                    updateField("askingPrice", event.target.value)
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
                  Pick one or two tones. Selected tones move into their own
                  space.
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
                      onClick={() => addTone(tone)}
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
                  <p className="text-sm font-bold text-slate-200">
                    Selected tone
                  </p>
                  <p className="text-xs text-slate-500">
                    Click one to remove it
                  </p>
                </div>

                {form.toneTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {form.toneTags.map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => removeTone(tone)}
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
                onChange={(event) => updateField("details", event.target.value)}
                rows={5}
                className="min-h-32 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base leading-6 outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
              />
            </section>

            <div className="flex flex-col items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleGenerate}
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
                onClick={handleReset}
                className="h-10 w-36 rounded-xl border border-slate-600 text-sm font-semibold transition hover:bg-slate-800 active:scale-[0.99]"
              >
                Reset
              </button>
            </div>
          </div>

          <div
            className={`${
              mobileView === "input" ? "hidden lg:block" : "block"
            } space-y-5`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Generated Listing
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Review the generated listing, choose the best version, then
                  check the marketplace preview.
                </p>
              </div>

              <button
                type="button"
                onClick={() => switchMobileView("input")}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-emerald-400 lg:hidden"
              >
                ← Back to Seller Input
              </button>
            </div>

            {!hasGeneratedListing ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center shadow-2xl shadow-black/30">
                <p className="text-xl font-black text-white">
                  Your listing will appear here
                </p>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                  Add what you are selling, choose the item condition, pick your
                  sale goal, then click Generate Listing.
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
            ) : (
              <div className="space-y-5">
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
                      <span className="font-semibold text-slate-200">
                        Category:
                      </span>{" "}
                      {selectedListing.category}
                    </p>

                    <p className="text-sm text-slate-400">
                      <span className="font-semibold text-slate-200">
                        Condition:
                      </span>{" "}
                      {form.condition || "Not specified"}
                    </p>

                    <p className="text-sm text-slate-400">
                      <span className="font-semibold text-slate-200">
                        Price source:
                      </span>{" "}
                      {selectedListing.priceSource}
                    </p>

                    <p className="text-sm text-slate-400">
                      <span className="font-semibold text-slate-200">
                        Tone:
                      </span>{" "}
                      {toneText(form.toneTags)}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-base font-bold text-slate-200">
                      Description
                    </p>
                    <div className="min-h-44 rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                      <p className="whitespace-pre-line text-base leading-7 text-slate-300">
                        {selectedListing.description}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-black/30 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
                        Listing Strategy
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Seller goal:{" "}
                        <span className="font-semibold text-slate-200">
                          {outcomeLabel(form.saleOutcome)}
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
                      <p className="text-sm text-slate-500">
                        Optional strategy change
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {listing.variants.map((variant, index) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => handleSelectVariant(index)}
                          disabled={isGenerating || !hasGeneratedListing}
                          className={`rounded-xl border p-4 text-left transition ${variantButtonClass(
                            index,
                          )}`}
                        >
                          <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
                            {variant.label}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {variant.note}
                          </p>
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
                        <p className="mb-2 text-sm font-bold text-slate-200">
                          Photos
                        </p>
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
                        <span className="font-semibold text-slate-200">
                          Condition:
                        </span>{" "}
                        {form.condition || "Not specified"}
                      </p>

                      <p className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-400">
                        <span className="font-semibold text-slate-200">
                          Category:
                        </span>{" "}
                        {selectedListing.category}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-bold text-slate-200">
                        Description
                      </p>
                      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                        <p className="whitespace-pre-line text-sm leading-6 text-slate-300">
                          {selectedListing.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={isGenerating || !hasGeneratedListing}
                  className={`h-14 w-full rounded-xl text-base font-black transition active:scale-[0.99] ${
                    copied
                      ? "bg-emerald-300 text-black"
                      : isGenerating || !hasGeneratedListing
                        ? "cursor-not-allowed bg-slate-700 text-slate-300"
                        : "bg-emerald-400 text-black hover:bg-emerald-300"
                  }`}
                >
                  {copied
                    ? "Copied ✓"
                    : isGenerating
                      ? "Preparing..."
                      : "Copy Full Listing"}
                </button>

                {resultNotice && (
                  <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm font-medium leading-6 text-amber-200">
                    {resultNotice}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center shadow-2xl shadow-black/20 sm:p-6">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
            Beta Feedback
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            Testing ZipList?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Try it with a real item, copy the generated listing, and tell me
            what worked, what confused you, and what would make ZipList more
            useful.
          </p>

          <a
            href={feedbackFormUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-400 px-6 text-base font-black text-black transition hover:bg-emerald-300 active:scale-[0.99]"
          >
            Give Feedback
          </a>

          <p className="mt-3 text-xs text-slate-500">
            Feedback opens in a short Google Form.
          </p>
        </section>
      </div>
    </main>
  );
}