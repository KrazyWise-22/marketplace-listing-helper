export function guessBasePrice(itemName: string, category: string) {
  const text = itemName.toLowerCase();

  const lookup: Record<string, Array<{ keywords: string[]; price: number }>> = {
    Electronics: [
      { keywords: ["iphone"], price: 450 },
      { keywords: ["ipad"], price: 300 },
      { keywords: ["macbook"], price: 700 },
      { keywords: ["laptop"], price: 350 },
      { keywords: ["computer"], price: 300 },
      { keywords: ["monitor"], price: 120 },
      { keywords: ["tv", "television"], price: 200 },
      { keywords: ["ps5", "playstation"], price: 400 },
      { keywords: ["xbox"], price: 300 },
      { keywords: ["switch", "nintendo"], price: 220 },
      { keywords: ["speaker", "speakers"], price: 100 },
      { keywords: ["receiver"], price: 150 },
      { keywords: ["camera"], price: 250 },
      { keywords: ["projector"], price: 200 },
      { keywords: ["phone"], price: 250 },
    ],

    Tools: [
      { keywords: ["air compressor", "compressor"], price: 150 },
      { keywords: ["drill"], price: 80 },
      { keywords: ["impact driver"], price: 100 },
      { keywords: ["circular saw"], price: 90 },
      { keywords: ["miter saw"], price: 180 },
      { keywords: ["table saw"], price: 300 },
      { keywords: ["grinder"], price: 70 },
      { keywords: ["sander"], price: 60 },
      { keywords: ["tool box"], price: 100 },
    ],

    Furniture: [
      { keywords: ["couch", "sofa"], price: 250 },
      { keywords: ["dresser"], price: 150 },
      { keywords: ["desk"], price: 120 },
      { keywords: ["table"], price: 140 },
      { keywords: ["chair"], price: 60 },
      { keywords: ["bed"], price: 250 },
    ],

    "Baby / Kids": [
      { keywords: ["baby swing", "swing"], price: 90 },
      { keywords: ["stroller"], price: 150 },
      { keywords: ["car seat"], price: 120 },
      { keywords: ["crib"], price: 180 },
      { keywords: ["high chair"], price: 80 },
    ],

    Clothing: [
      { keywords: ["jacket"], price: 40 },
      { keywords: ["shoes"], price: 50 },
      { keywords: ["boots"], price: 60 },
    ],

    Toys: [
      { keywords: ["lego"], price: 60 },
      { keywords: ["playset"], price: 75 },
    ],

    "Sports / Outdoors": [
      { keywords: ["bike", "bicycle"], price: 250 },
      { keywords: ["ebike", "e-bike", "electric bike"], price: 900 },
      { keywords: ["treadmill"], price: 300 },
      { keywords: ["kayak"], price: 350 },
    ],

    "Home / Kitchen": [
      { keywords: ["air fryer"], price: 70 },
      { keywords: ["microwave"], price: 90 },
      { keywords: ["coffee maker"], price: 60 },
      { keywords: ["vacuum"], price: 120 },
    ],
  };

  const categoryItems = lookup[category];

  if (categoryItems) {
    for (const item of categoryItems) {
      if (item.keywords.some(keyword => text.includes(keyword))) {
        return item.price;
      }
    }
  }

  switch (category) {
    case "Electronics":
      return 150;

    case "Tools":
      return 100;

    case "Furniture":
      return 150;

    case "Baby / Kids":
      return 80;

    case "Sports / Outdoors":
      return 120;

    case "Home / Kitchen":
      return 80;

    case "Clothing":
      return 30;

    case "Toys":
      return 40;

    default:
      return 50;
  }
}