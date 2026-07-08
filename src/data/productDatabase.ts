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
,
{
  keywords: [
    "ebike",
    "e-bike",
    "electric bike",
    "electric bicycle"
  ],
  category: "Sports / Outdoors",
  retailRange: "$600-$2500",
  specs: [
    "Electric Motor",
    "Rechargeable Battery",
    "Pedal Assist",
    "Battery Charger"
  ]
},

{
  keywords: [
    "nintendo switch",
    "switch oled",
    "switch lite"
  ],
  category: "Electronics",
  retailRange: "$150-$350",
  specs: [
    "Nintendo Game Console",
    "Portable Gaming",
    "Wireless Controllers",
    "HDMI Output"
  ]
},

{
  keywords: [
    "xbox series x",
    "xbox series s"
  ],
  category: "Electronics",
  retailRange: "$250-$500",
  specs: [
    "Microsoft Game Console",
    "4K Gaming",
    "Solid State Drive",
    "Wireless Controller"
  ]
},

{
  keywords: [
    "dyson vacuum",
    "dyson cordless",
    "dyson v11",
    "dyson v15"
  ],
  category: "Home",
  retailRange: "$250-$800",
  specs: [
    "Cordless Vacuum",
    "Cyclonic Filtration",
    "Rechargeable Battery",
    "Bagless Dust Bin"
  ]
},

{
  keywords: [
    "kitchenaid mixer",
    "artisan mixer",
    "stand mixer"
  ],
  category: "Home",
  retailRange: "$200-$500",
  specs: [
    "Stand Mixer",
    "Multiple Speed Settings",
    "Mixing Bowl",
    "Accessory Hub"
  ]
},

{
  keywords: [
    "milwaukee impact",
    "milwaukee drill",
    "milwaukee driver"
  ],
  category: "Tools",
  retailRange: "$100-$350",
  specs: [
    "Cordless Power Tool",
    "Lithium-Ion Battery",
    "Variable Speed",
    "LED Work Light"
  ]
},

{
  keywords: [
    "dewalt drill",
    "dewalt impact",
    "dewalt driver"
  ],
  category: "Tools",
  retailRange: "$100-$350",
  specs: [
    "Cordless Power Tool",
    "Lithium-Ion Battery",
    "Variable Speed",
    "LED Work Light"
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