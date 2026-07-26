function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

export function detectCategory(
  itemName: string,
  details: string
) {
  const text = `${itemName} ${details}`.toLowerCase();

  if (
    includesAny(text, [
      "baby",
      "toddler",
      "kids",
      "kid ",
      "crib",
      "stroller",
      "car seat",
      "high chair",
      "walker",
      "bouncer",
      "bassinet",
      "playpen",
      "pack n play",
      "pack-n-play",
      "diaper",
      "nursery",
    ])
  ) {
    return "Baby / Kids";
  }

  if (
    includesAny(text, [
      "drill",
      "saw",
      "tool",
      "wrench",
      "socket",
      "hammer",
      "grinder",
      "sander",
      "dewalt",
      "milwaukee",
      "ryobi",
      "craftsman",
      "skil",
    ])
  ) {
    return "Tools";
  }

  if (
    includesAny(text, [
      "iphone",
      "phone",
      "tv",
      "television",
      "laptop",
      "computer",
      "tablet",
      "ipad",
      "monitor",
      "xbox",
      "playstation",
      "ps5",
      "nintendo",
      "switch",
      "macbook",
      "galaxy",
      "camera",
      "projector",
      "speaker",
      "speakers",
      "receiver",
      "charger",
      "power bank",
      "headphones",
      "earbuds",
    ])
  ) {
    return "Electronics";
  }

  if (
    includesAny(text, [
      "couch",
      "sofa",
      "chair",
      "table",
      "desk",
      "dresser",
      "bed",
      "nightstand",
      "cabinet",
      "shelf",
      "bookcase",
      "mattress",
    ])
  ) {
    return "Furniture";
  }

  if (
    includesAny(text, [
      "shirt",
      "pants",
      "jacket",
      "shoes",
      "boots",
      "hoodie",
      "nike",
      "dress",
      "coat",
      "jeans",
    ])
  ) {
    return "Clothing";
  }

  if (
    includesAny(text, [
      "air fryer",
      "microwave",
      "coffee maker",
      "blender",
      "mixer",
      "vacuum",
      "lamp",
      "rug",
      "curtains",
      "dishes",
      "cookware",
    ])
  ) {
    return "Home / Kitchen";
  }

  if (
    includesAny(text, [
      "bike",
      "bicycle",
      "treadmill",
      "weights",
      "dumbbell",
      "tent",
      "cooler",
      "fishing",
      "golf",
      "kayak",
      "sports",
    ])
  ) {
    return "Sports / Outdoors";
  }

  if (
    includesAny(text, [
      "toy",
      "game",
      "puzzle",
      "lego",
      "doll",
      "playset",
    ])
  ) {
    return "Toys";
  }

  return "General";
}