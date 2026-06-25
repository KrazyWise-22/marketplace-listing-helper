export type ProductProfile = {
  keywords: string[];
  category: string;
  specs: string[];
  retailRange: string;
};

export const productDatabase: ProductProfile[] = [
  {
    keywords: [
      "kobalt air compressor",
      "6 gallon pancake compressor",
      "02106410"
    ],
    category: "Tools",
    retailRange: "$150-$180",
    specs: [
      "6-Gallon Tank",
      "150 PSI Maximum Pressure",
      "Oil-Free Pump",
      "Dual Quick Connect Couplers",
      "1 HP Motor",
      "Portable Pancake Design"
    ]
  },

  {
    keywords: [
      "babybond baby swing",
      "babybond swing"
    ],
    category: "Baby / Kids",
    retailRange: "$80-$120",
    specs: [
      "Electric Swing",
      "Multiple Swing Speeds",
      "Infant Comfort Seat",
      "Compact Footprint"
    ]
  },

  {
    keywords: [
      "ps5",
      "playstation 5"
    ],
    category: "Electronics",
    retailRange: "$400-$500",
    specs: [
      "Sony PlayStation 5",
      "4K Gaming",
      "Solid State Drive",
      "Wireless Controller Support"
    ]
  },

  {
    keywords: [
      "iphone 13"
    ],
    category: "Electronics",
    retailRange: "$300-$450",
    specs: [
      "Apple Smartphone",
      "Face ID",
      "Dual Camera System",
      "5G Compatible"
    ]
  }
];

export function findProduct(itemName: string) {
  const lowerName = itemName.toLowerCase();

  return productDatabase.find(product =>
    product.keywords.some(keyword =>
      lowerName.includes(keyword.toLowerCase())
    )
  );
}