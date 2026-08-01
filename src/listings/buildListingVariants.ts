import { identifyProduct } from "../ai/identifyProduct";
import { detectCategory } from "../detection/detectCategory";
import { buildPrice } from "../pricing/buildPrice";
import { buildPriceSource } from "../pricing/buildPriceSource";
import type {
  FormData,
  ListingVariant,
  SaleOutcome,
  ToneTag,
  VariantId,
} from "../types/listing";
import { buildCopyText } from "./buildCopyText";
import { buildTitle } from "./buildTitle";

type GeneratedVariantId = Exclude<VariantId, "placeholder">;

type BuildDescription = (
  form: FormData,
  category: string,
  variant: VariantId,
  price: string,
) => string;

type OutcomeLabel = (outcome: SaleOutcome) => string;

type ToneText = (toneTags: ToneTag[]) => string;

interface BuildListingVariantDependencies {
  buildDescription: BuildDescription;
  outcomeLabel: OutcomeLabel;
  toneText: ToneText;
}

interface LegacyProductDetails {
  specs: unknown[];
  retailRange: unknown;
}

function hasLegacyProductDetails(
  productInfo: unknown,
): productInfo is LegacyProductDetails {
  return (
    typeof productInfo === "object" &&
    productInfo !== null &&
    "specs" in productInfo &&
    Array.isArray(productInfo.specs) &&
    "retailRange" in productInfo
  );
}

export async function buildListingVariants(
  form: FormData,
  dependencies: BuildListingVariantDependencies,
): Promise<ListingVariant[]> {
  const { buildDescription, outcomeLabel, toneText } = dependencies;

  const category =
    form.categoryOverride || detectCategory(form.itemName, form.details);

  const productInfo = await identifyProduct(form);

  const variantPlan: Array<{
    id: GeneratedVariantId;
    label: string;
    note: string;
    titleVariant: GeneratedVariantId;
    strategy: string;
  }> = [
    {
      id: "recommended",
      label: "Recommended",
      note: "Balanced listing based on the seller goal.",
      titleVariant: "recommended",
      strategy: `Auto-chosen for ${outcomeLabel(
        form.saleOutcome,
      )} with ${toneText(form.toneTags)} tone.`,
    },
    {
      id: "fast",
      label: "Faster Sale",
      note: "Good deal, light urgency, easier action.",
      titleVariant: "fast",
      strategy:
        "Built to make the item feel like a good deal and encourage faster action.",
    },
    {
      id: "value",
      label: "Higher Value",
      note: "Talks up the product without overhyping.",
      titleVariant: "value",
      strategy:
        "Built to support a stronger asking price by highlighting why the item is worth considering.",
    },
    {
      id: "honest",
      label: "Clear & Honest",
      note: "Condition-forward and buyer-friendly.",
      titleVariant: "honest",
      strategy:
        "Built to reduce confusion and wasted messages by being clear about condition and details.",
    },
  ];

  return Promise.all(
    variantPlan.map(async (variant) => {
      const title = buildTitle(form, category, variant.titleVariant);
      const price = await buildPrice(form, category, variant.id);
      const priceSource = buildPriceSource(form, variant.id);

      let description = buildDescription(
        form,
        category,
        variant.id,
        price,
      );

      if (hasLegacyProductDetails(productInfo)) {
        description += `

Specifications:
${productInfo.specs.map((spec) => `• ${String(spec)}`).join("\n")}

Typical Retail Range:
${String(productInfo.retailRange)}`;
      }

      return {
        id: variant.id,
        label: variant.label,
        note: variant.note,
        title,
        price,
        priceSource,
        category,
        description,
        strategy: variant.strategy,
        copyText: buildCopyText(
          title,
          price,
          form.condition || "Not specified",
          category,
          description,
        ),
      };
    }),
  );
}