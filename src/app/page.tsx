"use client";

import { useState } from "react";

type Platform = "facebook" | "craigslist" | "ebay" | "offerup";

type FormData = {
  itemName: string;
  brand: string;
  condition: string;
  originalPrice: string;
  sellSpeed: string;
  listingStyle: string;
  platform: Platform;
  details: string;
};

type PriceTiers = {
  quickSale: string;
  balanced: string;
  maxValue: string;
};

type ListingOutput = {
  title: string;
  price: string;
  priceTiers: PriceTiers;
  category: string;
  description: string;
  tips: string[];
  copyPreview: string;
};

const initialForm: FormData = {
  itemName: "",
  brand: "",
  condition: "",
  originalPrice: "",
  sellSpeed: "",
  listingStyle: "Professional",
  platform: "facebook",
  details: "",
};

const initialListing: ListingOutput = {
  title: "Your generated title will appear here",
  price: "—",
  priceTiers: {
    quickSale: "—",
    balanced: "—",
    maxValue: "—",
  },
  category: "Category auto-detected",
  description: "Your generated description will appear here.",
  tips: [
    "Add at least 3 clear photos.",
    "Clearly state pickup or delivery options.",
    "Be upfront about any flaws.",
  ],
  copyPreview: `Your generated title will appear here

Price: —

Your generated description will appear here.`,
};

function parsePrice(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function itemNameAlreadyHasBrand(itemName: string, brand: string): boolean {
  const normalizedItem = normalizeText(itemName);
  const normalizedBrand = normalizeText(brand);

  if (!normalizedItem || !normalizedBrand) return false;

  return normalizedItem.startsWith(normalizedBrand);
}

function buildDisplayName(form: FormData): string {
  const itemName = form.itemName.trim();
  const brand = form.brand.trim();

  if (!itemName && !brand) return "item";
  if (!itemName) return brand;
  if (!brand) return itemName;

  if (itemNameAlreadyHasBrand(itemName, brand)) {
    return itemName;
  }

  return `${brand} ${itemName}`;
}

function detectCategory(itemName: string, details: string, brand: string): string {
  const text = `${itemName} ${details} ${brand}`.toLowerCase();

  if (
    text.includes("tv") ||
    text.includes("television") ||
    text.includes("monitor") ||
    text.includes("laptop") ||
    text.includes("computer") ||
    text.includes("phone") ||
    text.includes("iphone") ||
    text.includes("samsung") ||
    text.includes("tablet") ||
    text.includes("ipad") ||
    text.includes("console") ||
    text.includes("playstation") ||
    text.includes("xbox")
  ) {
    return "Electronics";
  }

  if (
    text.includes("couch") ||
    text.includes("sofa") ||
    text.includes("table") ||
    text.includes("dresser") ||
    text.includes("chair") ||
    text.includes("desk") ||
    text.includes("bed")
  ) {
    return "Furniture";
  }

  if (
    text.includes("drill") ||
    text.includes("saw") ||
    text.includes("tool") ||
    text.includes("wrench") ||
    text.includes("socket") ||
    text.includes("hammer")
  ) {
    return "Tools";
  }

  if (
    text.includes("shoe") ||
    text.includes("jacket") ||
    text.includes("shirt") ||
    text.includes("hoodie") ||
    text.includes("pants")
  ) {
    return "Clothing";
  }

  return "General";
}

function buildTitle(form: FormData, platform: Platform): string {
  const displayName = buildDisplayName(form);
  const condition = form.condition.trim();

  if (!displayName || displayName === "item") {
    if (condition) return platform === "ebay" ? `Used Item - ${condition}` : `Used Item - ${condition}`;
    return "Untitled Listing";
  }

  if (platform === "ebay") {
    if (condition) return `${displayName} ${condition}`.replace(/\s+/g, " ").trim();
    return displayName;
  }

  if (!condition) {
    return displayName;
  }

  return `${displayName} - ${condition}`;
}

function roundToNearestFive(value: number): number {
  return Math.max(5, Math.round(value / 5) * 5);
}

function guessBasePrice(itemName: string, category: string, brand: string): number {
  const text = `${itemName} ${brand}`.toLowerCase();

  if (text.includes("tv") || text.includes("television")) return 180;
  if (text.includes("laptop")) return 250;
  if (text.includes("computer")) return 200;
  if (text.includes("phone") || text.includes("iphone")) return 180;
  if (text.includes("monitor")) return 100;
  if (text.includes("tablet") || text.includes("ipad")) return 140;
  if (text.includes("playstation") || text.includes("ps5") || text.includes("xbox")) return 250;

  if (text.includes("couch") || text.includes("sofa")) return 150;
  if (text.includes("dresser")) return 120;
  if (text.includes("desk")) return 100;
  if (text.includes("table")) return 90;
  if (text.includes("chair")) return 50;
  if (text.includes("bed")) return 140;

  if (text.includes("drill")) return 45;
  if (text.includes("saw")) return 60;
  if (text.includes("tool")) return 35;
  if (text.includes("hammer")) return 20;

  if (text.includes("jacket")) return 25;
  if (text.includes("shoe")) return 30;
  if (text.includes("shirt")) return 15;
  if (text.includes("hoodie")) return 20;
  if (text.includes("pants")) return 20;

  switch (category) {
    case "Electronics":
      return 100;
    case "Furniture":
      return 80;
    case "Tools":
      return 40;
    case "Clothing":
      return 20;
    default:
      return 30;
  }
}

function getConditionMultiplier(condition: string): number {
  switch (condition) {
    case "New":
      return 0.85;
    case "Like New":
      return 0.7;
    case "Good":
      return 0.55;
    case "Fair":
      return 0.35;
    case "For Parts":
      return 0.15;
    default:
      return 0.5;
  }
}

function calculateBaseValuation(form: FormData, category: string): number {
  const original = parsePrice(form.originalPrice);
  const conditionMultiplier = getConditionMultiplier(form.condition);

  if (original > 0) {
    return original * conditionMultiplier;
  }

  const guessedBase = guessBasePrice(form.itemName, category, form.brand);
  return guessedBase * conditionMultiplier;
}

function buildPriceTiers(form: FormData, category: string): PriceTiers {
  const baseValuation = calculateBaseValuation(form, category);

  return {
    quickSale: `$${roundToNearestFive(baseValuation * 0.85)}`,
    balanced: `$${roundToNearestFive(baseValuation)}`,
    maxValue: `$${roundToNearestFive(baseValuation * 1.15)}`,
  };
}

function ensurePeriod(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function buildIntro(displayName: string, condition: string): string {
  if (displayName === "item" && condition) {
    return `Used item in ${condition.toLowerCase()} condition.`;
  }

  if (displayName === "item") {
    return "Used item for sale.";
  }

  if (condition) {
    return `${displayName} in ${condition.toLowerCase()} condition.`;
  }

  return `${displayName}.`;
}

function buildDetailsFallback(displayName: string, category: string): string {
  if (displayName !== "item") {
    if (category === "Electronics") return "Works as expected and is ready to use.";
    if (category === "Furniture") return "Solid piece and ready for its next home.";
    if (category === "Tools") return "Ready to use for your next project.";
    if (category === "Clothing") return "Clean and ready to wear.";
    return "Ready for its next owner.";
  }

  return "Available now and ready for pickup or delivery details to be discussed.";
}

function buildPlatformDescription(
  form: FormData,
  variation: number,
  category: string,
): string {
  const displayName = buildDisplayName(form);
  const condition = form.condition.trim();
  const details = ensurePeriod(form.details);
  const fallbackDetails = buildDetailsFallback(displayName, category);
  const platform = form.platform;
  const style = form.listingStyle || "Professional";
  const intro = buildIntro(displayName, condition);

  if (platform === "facebook") {
    const variants = [
      [
        intro,
        details || fallbackDetails,
        style === "Fast sale" ? "Priced to sell." : "",
        "Message me if interested.",
      ],
      [
        displayName === "item" ? "Nice item for sale." : `Nice ${displayName}.`,
        condition ? `It is in ${condition.toLowerCase()} condition.` : "",
        details || fallbackDetails,
        "Send me a message if you want it.",
      ],
      [
        displayName === "item" ? "Available now." : `${displayName} available now.`,
        details || fallbackDetails,
        style === "Fast sale" ? "Trying to move it quickly." : "",
        "Feel free to reach out.",
      ],
    ];

    return variants[variation % variants.length].filter(Boolean).join(" ");
  }

  if (platform === "craigslist") {
    const variants = [
      [
        displayName === "item" ? "Item for sale." : `${displayName} for sale.`,
        condition ? `Condition: ${condition}.` : "",
        details || fallbackDetails,
        "Please message with any questions.",
      ],
      [
        displayName === "item" ? "Used item available." : `${displayName} available.`,
        condition ? `${condition} condition.` : "",
        details || fallbackDetails,
        "Pickup or delivery details can be discussed.",
      ],
      [
        displayName === "item" ? "Selling a used item." : `Selling ${displayName}.`,
        condition ? `It is in ${condition.toLowerCase()} condition.` : "",
        details || fallbackDetails,
        "Serious inquiries only.",
      ],
    ];

    return variants[variation % variants.length].filter(Boolean).join(" ");
  }

  if (platform === "ebay") {
    const variants = [
      [
        displayName === "item" ? "Pre-owned item." : `${displayName}.`,
        condition ? `Condition: ${condition}.` : "",
        details || fallbackDetails,
        "Please review the listing details carefully before purchase.",
      ],
      [
        displayName === "item" ? "Item available for sale." : `${displayName} available for sale.`,
        condition ? `This item is listed as ${condition.toLowerCase()}.` : "",
        details || fallbackDetails,
        "Message with any questions.",
      ],
      [
        displayName === "item" ? "Pre-owned item in good working order." : `${displayName} in solid condition.`,
        condition ? `Rated ${condition.toLowerCase()}.` : "",
        details || fallbackDetails,
        "See full details in the listing description.",
      ],
    ];

    return variants[variation % variants.length].filter(Boolean).join(" ");
  }

  const offerUpVariants = [
    [
      intro,
      details || "Works great and ready to go.",
      "Fast sale preferred.",
      "Message me if interested.",
    ],
    [
      displayName === "item" ? "Item for sale." : `${displayName} for sale.`,
      condition ? `${condition} condition.` : "",
      details || "Works well and ready for pickup.",
      "Need it gone soon.",
    ],
    [
      displayName === "item" ? "Available now." : `${displayName} available now.`,
      details || "Good working condition and ready to use.",
      "First serious message gets it.",
    ],
  ];

  return offerUpVariants[variation % offerUpVariants.length].filter(Boolean).join(" ");
}

function buildTips(form: FormData, category: string): string[] {
  const tips: string[] = [];

  if (form.sellSpeed === "Fast sale") {
    tips.push("Price slightly lower for a quicker sale.");
  }

  if (form.condition === "Fair" || form.condition === "For Parts") {
    tips.push("Clearly show flaws in photos and description.");
  }

  if (!form.details.toLowerCase().includes("pickup")) {
    tips.push("State whether it is pickup only or delivery is available.");
  }

  if (!form.itemName.trim()) {
    tips.push("Add the item name for a more specific title and price estimate.");
  }

  if (!form.condition.trim()) {
    tips.push("Add the condition for a more accurate price suggestion.");
  }

  if (form.platform === "ebay") {
    tips.push("Include model number, storage, or exact specs for buyer confidence.");
  } else if (category === "Electronics") {
    tips.push("Include model number, screen size, or storage details.");
  } else if (category === "Furniture") {
    tips.push("Include dimensions and any visible wear.");
  } else if (category === "Tools") {
    tips.push("Mention brand, power type, and included accessories.");
  } else {
    tips.push("Use bright, clear photos from multiple angles.");
  }

  return tips.slice(0, 4);
}

function buildCopyPreview(listing: ListingOutput, platform: Platform): string {
  if (platform === "craigslist") {
    return `${listing.title}

Price: ${listing.price}
Category: ${listing.category}

Description:
${listing.description}`;
  }

  if (platform === "ebay") {
    return `${listing.title}

Price: ${listing.price}

Condition: ${listing.category === "Category auto-detected" ? "See details" : "See listing details"}

${listing.description}`;
  }

  return `${listing.title}

Price: ${listing.price}

${listing.description}`;
}

function getPlatformLabel(platform: Platform): string {
  switch (platform) {
    case "facebook":
      return "Facebook Marketplace";
    case "craigslist":
      return "Craigslist";
    case "ebay":
      return "eBay";
    case "offerup":
      return "OfferUp";
    default:
      return "Platform";
  }
}

export default function Home() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [listing, setListing] = useState<ListingOutput>(initialListing);
  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"quick" | "balanced" | "max">(
    "balanced",
  );
  const [descriptionVariation, setDescriptionVariation] = useState(0);

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function buildListing(variation: number, tier: "quick" | "balanced" | "max") {
    const category = detectCategory(form.itemName, form.details, form.brand);
    const priceTiers = buildPriceTiers(form, category);

    const price =
      tier === "quick"
        ? priceTiers.quickSale
        : tier === "max"
          ? priceTiers.maxValue
          : priceTiers.balanced;

    const title = buildTitle(form, form.platform);
    const description = buildPlatformDescription(form, variation, category);
    const tips = buildTips(form, category);

    const nextListingBase = {
      title,
      price,
      priceTiers,
      category,
      description,
      tips,
    };

    const copyPreview = buildCopyPreview(nextListingBase, form.platform);

    return {
      ...nextListingBase,
      copyPreview,
    };
  }

  function handleGenerate() {
    let defaultTier: "quick" | "balanced" | "max" = "balanced";

    if (form.sellSpeed === "Fast sale") defaultTier = "quick";
    if (form.sellSpeed === "Max value") defaultTier = "max";

    setSelectedTier(defaultTier);
    setDescriptionVariation(0);

    const nextListing = buildListing(0, defaultTier);
    setListing(nextListing);
    setCopied(false);
  }

  function handleRegenerateDescription() {
    const nextVariation = descriptionVariation + 1;
    setDescriptionVariation(nextVariation);

    const nextListing = buildListing(nextVariation, selectedTier);
    setListing(nextListing);
    setCopied(false);
  }

  function handleSelectTier(tier: "quick" | "balanced" | "max") {
    setSelectedTier(tier);
    const nextListing = buildListing(descriptionVariation, tier);
    setListing(nextListing);
  }

  function handleReset() {
    setForm(initialForm);
    setListing(initialListing);
    setCopied(false);
    setSelectedTier("balanced");
    setDescriptionVariation(0);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(listing.copyPreview);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <header className="mb-6 text-center sm:mb-8 lg:text-left">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-400 sm:text-sm">
            Marketplace Listing Helper
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Turn rough item details into a cleaner listing
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base lg:max-w-none lg:text-lg">
            Enter basic item details, then generate and copy a cleaner listing.
          </p>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            Version 1 — currently being tested. Feedback is welcome.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2 lg:gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">Item Details</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Fill this out like a rough draft.
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-xl border border-slate-600 px-4 py-2 font-semibold text-slate-200 transition hover:bg-slate-800 sm:w-auto"
              >
                Reset
              </button>
            </div>

            <div className="grid gap-4 sm:gap-5">
              <div>
                <label
                  htmlFor="itemName"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Item name
                </label>
                <input
                  id="itemName"
                  autoFocus
                  type="text"
                  value={form.itemName}
                  onChange={(e) => updateField("itemName", e.target.value)}
                  placeholder="Example: Samsung 55-inch TV"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 sm:text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Brand (optional)
                </label>
                <input
                  id="brand"
                  type="text"
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  placeholder="Example: Samsung"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 sm:text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="condition"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Condition
                </label>
                <select
                  id="condition"
                  value={form.condition}
                  onChange={(e) => updateField("condition", e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 sm:text-base"
                >
                  <option value="">Select condition</option>
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>For Parts</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="originalPrice"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Original price (optional)
                </label>
                <input
                  id="originalPrice"
                  type="text"
                  value={form.originalPrice}
                  onChange={(e) => updateField("originalPrice", e.target.value)}
                  placeholder="Example: 600"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 sm:text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="sellSpeed"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Desired selling speed
                </label>
                <select
                  id="sellSpeed"
                  value={form.sellSpeed}
                  onChange={(e) => updateField("sellSpeed", e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 sm:text-base"
                >
                  <option value="">Select speed</option>
                  <option>Fast sale</option>
                  <option>Balanced</option>
                  <option>Max value</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="listingStyle"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Listing style
                </label>
                <select
                  id="listingStyle"
                  value={form.listingStyle}
                  onChange={(e) => updateField("listingStyle", e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 sm:text-base"
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Fast sale</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="platform"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Posting platform
                </label>
                <select
                  id="platform"
                  value={form.platform}
                  onChange={(e) => updateField("platform", e.target.value as Platform)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 sm:text-base"
                >
                  <option value="facebook">Facebook Marketplace</option>
                  <option value="craigslist">Craigslist</option>
                  <option value="ebay">eBay</option>
                  <option value="offerup">OfferUp</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Extra details
                </label>
                <textarea
                  id="details"
                  rows={5}
                  value={form.details}
                  onChange={(e) => updateField("details", e.target.value)}
                  placeholder="Example: Works great, includes remote, small scratch on frame, pickup only."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 sm:text-base"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Generate Listing
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:mb-6">
              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">Generated Listing</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Optimized for {getPlatformLabel(form.platform)}.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleRegenerateDescription}
                  className="w-full rounded-xl border border-slate-600 px-4 py-2 font-semibold text-slate-200 transition hover:bg-slate-800"
                >
                  Regenerate Description
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full rounded-xl border border-emerald-400 px-4 py-2 font-semibold text-emerald-400 transition hover:bg-emerald-400 hover:text-slate-950"
                >
                  {copied ? "Copied!" : "Copy Full Listing"}
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-400 sm:text-xs">
                  Suggested title
                </p>
                <p className="text-base font-semibold text-slate-100 sm:text-lg">
                  {listing.title}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-400 sm:text-xs">
                  Suggested price
                </p>
                <p className="text-lg font-semibold text-emerald-400 sm:text-xl">
                  {listing.price}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div
                  onClick={() => handleSelectTier("quick")}
                  className={`cursor-pointer rounded-xl border p-5 transition sm:p-4 ${
                    selectedTier === "quick"
                      ? "border-emerald-400 bg-slate-900"
                      : "border-slate-800 bg-slate-950"
                  }`}
                >
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-400 sm:text-xs">
                    Quick Sale
                  </p>
                  <p className="text-base font-semibold text-slate-100">
                    {listing.priceTiers.quickSale}
                  </p>
                </div>

                <div
                  onClick={() => handleSelectTier("balanced")}
                  className={`cursor-pointer rounded-xl border p-5 transition sm:p-4 ${
                    selectedTier === "balanced"
                      ? "border-emerald-400 bg-slate-900"
                      : "border-slate-800 bg-slate-950"
                  }`}
                >
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-400 sm:text-xs">
                    Balanced
                  </p>
                  <p className="text-base font-semibold text-slate-100">
                    {listing.priceTiers.balanced}
                  </p>
                </div>

                <div
                  onClick={() => handleSelectTier("max")}
                  className={`cursor-pointer rounded-xl border p-5 transition sm:p-4 ${
                    selectedTier === "max"
                      ? "border-emerald-400 bg-slate-900"
                      : "border-slate-800 bg-slate-950"
                  }`}
                >
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-400 sm:text-xs">
                    Max Value
                  </p>
                  <p className="text-base font-semibold text-slate-100">
                    {listing.priceTiers.maxValue}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-400 sm:text-xs">
                  Category
                </p>
                <p className="text-sm text-slate-200 sm:text-base">{listing.category}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-400 sm:text-xs">
                  Description
                </p>
                <p className="text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                  {listing.description}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-400 sm:text-xs">
                  Selling tips
                </p>
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300 sm:text-base">
                  {listing.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-400 sm:text-xs">
                  {getPlatformLabel(form.platform)} copy preview
                </p>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-300 sm:leading-7">
                  {listing.copyPreview}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}