import type {
  FormData,
  ListingVariant,
} from "../types/listing";

import { identifyProduct } from "../ai/identifyProduct";
import { buildTitle } from "./buildTitle";
import { buildDescription } from "./buildDescription";
import { buildCopyText } from "./buildCopyText";

export async function buildListingVariants(
  form: FormData
): Promise<ListingVariant[]> {
  const product = await identifyProduct(form);

  console.dir(product, { depth: null });

  const category =
    product?.category ||
    form.categoryOverride ||
    "General";

  return [
    {
      id: "recommended",
      label: "Recommended",
      note: "",
      title: buildTitle(
  form,
  category,
  "recommended"
),
      price: "",
      priceSource: "",
      category,
      description: buildDescription(form, category),
      strategy: "",
      copyText: buildCopyText(),
    },
  ];
}