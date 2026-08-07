import type {
  FormData,
  ListingOutput,
  ToneTag,
} from "../types/listing";

export const maxPhotoCount = 20;

export const emptyForm: FormData = {
  itemName: "",
  condition: "",
  categoryOverride: "",
  saleOutcome: "balanced",
  askingPrice: "",
  toneTags: [],
  details: "",
};

export const emptyListing: ListingOutput = {
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

export const toneOptions: ToneTag[] = [
  "Friendly",
  "Professional",
  "Simple",
  "Detailed",
  "Confident",
  "Casual",
  "Trustworthy",
  "Short",
];

export const feedbackFormUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSdWytfydGV7Z8VcR0BEvTmsmhpEdwlFyWZxbR7iGhq_kGAmtA/viewform?usp=publish-editor";

export const listingCategories = [
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