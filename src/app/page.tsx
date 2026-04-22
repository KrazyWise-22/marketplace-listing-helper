"use client";

import { useState } from "react";

type FormData = {
  itemName: string;
  brand: string;
  condition: string;
  originalPrice: string;
  sellSpeed: string;
  listingStyle: string;
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
};

const initialForm: FormData = {
  itemName: "",
  brand: "",
  condition: "",
  originalPrice: "",
  sellSpeed: "",
  listingStyle: "Professional",
  details: "",
};

const initialListing: ListingOutput = {
  title: "Your generated title will appear here",
  price: "$0",
  priceTiers: {
    quickSale: "$0",
    balanced: "$0",
    maxValue: "$0",
  },
  category: "Category will appear here",
  description: "Your generated description will appear here.",
  tips: [
    "Add at least 3 clear photos.",
    "Mention pickup or delivery details.",
    "Be honest about flaws.",
  ],
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
    text.includes("ipad")
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

function buildTitle(form: FormData): string {
  const displayName = buildDisplayName(form);
  const condition = form.condition.trim();

  if (!displayName || displayName === "item") {
    if (condition) return `Used Item - ${condition}`;
    return "Untitled Listing";
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

function buildDescription(
  form: FormData,
  variation: number,
  category: string,
): string {
  const displayName = buildDisplayName(form);
  const condition = form.condition.trim();
  const details = ensurePeriod(form.details);
  const style = form.listingStyle || "Professional";

  const intro = buildIntro(displayName, condition);
  const fallbackDetails = buildDetailsFallback(displayName, category);

  const professionalVariants = [
    [
      intro,
      details || fallbackDetails,
      "Message me if you have any questions.",
    ],
    [
      displayName === "item" ? "Selling this item." : `Selling this ${displayName}.`,
      condition ? `It is in ${condition.toLowerCase()} condition.` : "",
      details || "Everything works as it should.",
      "Feel free to reach out with any questions.",
    ],
    [
      displayName === "item" ? "Item available now." : `${displayName} available now.`,
      condition ? `Condition is ${condition.toLowerCase()}.` : "",
      details || "Clean and ready for its next owner.",
      "Send a message if interested.",
    ],
  ];

  const friendlyVariants = [
    [
      displayName === "item" ? "Nice item for sale." : `Nice ${displayName}.`,
      condition ? `It is in ${condition.toLowerCase()} condition.` : "",
      details || fallbackDetails,
      "Feel free to message me if you are interested.",
    ],
    [
      displayName === "item" ? "Really solid item." : `Really solid ${displayName}.`,
      condition ? `Still in ${condition.toLowerCase()} condition.` : "",
      details || "Ready to go and works well.",
      "Just send me a message if you want it.",
    ],
    [
      displayName === "item" ? "Item up for sale." : `${displayName} up for sale.`,
      condition ? `It is in ${condition.toLowerCase()} condition.` : "",
      details || "Good working item and ready for a new home.",
      "Message me anytime if interested.",
    ],
  ];

  const fastSaleVariants = [
    [
      intro,
      details || "Works great and ready to go.",
      "Priced to sell.",
      "Message me if interested.",
    ],
    [
      displayName === "item" ? "Item for sale." : `${displayName} for sale.`,
      condition ? `${condition} condition.` : "",
      details || "Works well and ready for pickup.",
      "Need it gone soon.",
      "Send a message if you want it.",
    ],
    [
      displayName === "item" ? "Item available now." : `${displayName} available now.`,
      condition ? `Still in ${condition.toLowerCase()} condition.` : "",
      details || "Good working condition and ready to use.",
      "Fast sale preferred.",
      "First serious message gets it.",
    ],
  ];

  const variants =
    style === "Friendly"
      ? friendlyVariants
      : style === "Fast sale"
        ? fastSaleVariants
        : professionalVariants;

  return variants[variation % variants.length].filter(Boolean).join(" ");
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

  if (category === "Electronics") {
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

function buildCopyText(listing: ListingOutput): string {
  return `${listing.title}

Price: ${listing.price}

${listing.description}`;
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

  function handleGenerate() {
    const category = detectCategory(form.itemName, form.details, form.brand);
    const title = buildTitle(form);
    const priceTiers = buildPriceTiers(form, category);

    let defaultTier: "quick" | "balanced" | "max" = "balanced";

    if (form.sellSpeed === "Fast sale") defaultTier = "quick";
    if (form.sellSpeed === "Max value") defaultTier = "max";

    setSelectedTier(defaultTier);
    setDescriptionVariation(0);

    const price =
      defaultTier === "quick"
        ? priceTiers.quickSale
        : defaultTier === "max"
          ? priceTiers.maxValue
          : priceTiers.balanced;

    const description = buildDescription(form, 0, category);
    const tips = buildTips(form, category);

    setListing({
      title,
      price,
      priceTiers,
      category,
      description,
      tips,
    });

    setCopied(false);
  }

  function handleRegenerateDescription() {
    const category = detectCategory(form.itemName, form.details, form.brand);
    const nextVariation = descriptionVariation + 1;
    setDescriptionVariation(nextVariation);

    setListing((prev) => ({
      ...prev,
      description: buildDescription(form, nextVariation, category),
    }));

    setCopied(false);
  }

  function handleReset() {
    setForm(initialForm);
    setListing(initialListing);
    setCopied(false);
    setSelectedTier("balanced");
    setDescriptionVariation(0);
  }

  async function handleCopy() {
    const textToCopy = buildCopyText(listing);
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  const fullListingText = buildCopyText(listing);

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
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base lg:text-lg lg:max-w-none">
            Enter basic item details, then generate and copy a cleaner listing.
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
                  Brand
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
                  Original price
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
                  Generate it, then copy it.
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
                  onClick={() => {
                    setSelectedTier("quick");
                    setListing((prev) => ({
                      ...prev,
                      price: prev.priceTiers.quickSale,
                    }));
                  }}
                  className={`cursor-pointer rounded-xl border p-5 sm:p-4 transition ${
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
                  onClick={() => {
                    setSelectedTier("balanced");
                    setListing((prev) => ({
                      ...prev,
                      price: prev.priceTiers.balanced,
                    }));
                  }}
                  className={`cursor-pointer rounded-xl border p-5 sm:p-4 transition ${
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
                  onClick={() => {
                    setSelectedTier("max");
                    setListing((prev) => ({
                      ...prev,
                      price: prev.priceTiers.maxValue,
                    }));
                  }}
                  className={`cursor-pointer rounded-xl border p-5 sm:p-4 transition ${
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
                  Marketplace copy preview
                </p>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-300 sm:text-sm sm:leading-7">
                  {fullListingText}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}