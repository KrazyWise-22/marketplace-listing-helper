"use client";

import { useState } from "react";

import { AppHeader } from "../components/AppHeader";
import { BetaFeedback } from "../components/BetaFeedback";
import { GeneratedPlaceholder } from "../components/GeneratedPlaceholder";
import { ListingDetails } from "../components/ListingDetails";
import { ListingStrategy } from "../components/ListingStrategy";
import { MarketplacePreview } from "../components/MarketplacePreview";
import { SellerInput } from "../components/SellerInput";

import {
  emptyForm,
  emptyListing,
  maxPhotoCount,
} from "../constants/app";

import type {
  FormData,
  ListingOutput,
  MobileView,
  PhotoPreview,
  ToneTag,
} from "../types/listing";

import {
  defaultVariantIndex,
  outcomeLabel,
  toneText,
} from "../utils/listingHelpers";

import { buildDescription } from "./descriptions/buildDescription";
import { buildListingVariants } from "../listings/buildListingVariants";
import { cleanText } from "../utils/textHelpers";

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

  const hasItemName = cleanText(form.itemName).length > 0;
  const hasCondition = cleanText(form.condition).length > 0;
  const hasGeneratedListing = selectedListing.id !== "placeholder";
  const hasPhotos = photoPreviews.length > 0;

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

    const remainingSlots = maxPhotoCount - photoPreviews.length;

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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <AppHeader />

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <SellerInput
            form={form}
            formNotice={formNotice}
            photoPreviews={photoPreviews}
            isGenerating={isGenerating}
            mobileView={mobileView}
            onUpdateField={updateField}
            onAddTone={addTone}
            onRemoveTone={removeTone}
            onPhotoUpload={handlePhotoUpload}
            onRemovePhoto={removePhoto}
            onGenerate={handleGenerate}
            onReset={handleReset}
          />

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
              <GeneratedPlaceholder />
            ) : (
              <div className="space-y-5">
                <ListingDetails
                  selectedListing={selectedListing}
                  condition={form.condition}
                  toneTags={form.toneTags}
                />

                <ListingStrategy
                  saleOutcome={form.saleOutcome}
                  selectedListing={selectedListing}
                  variants={listing.variants}
                  selectedVariantIndex={listing.selectedVariantIndex}
                  isGenerating={isGenerating}
                  hasGeneratedListing={hasGeneratedListing}
                  onSelectVariant={handleSelectVariant}
                />

                <MarketplacePreview
                  selectedListing={selectedListing}
                  condition={form.condition}
                  photoPreviews={photoPreviews}
                />

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

        <BetaFeedback />
      </div>
    </main>
  );
}
