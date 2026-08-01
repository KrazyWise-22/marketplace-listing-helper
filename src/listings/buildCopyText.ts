export function buildCopyText(
  title: string,
  price: string,
  condition: string,
  category: string,
  description: string,
): string {
  return `${title}

Price: ${price}
Condition: ${condition || "Not specified"}
Category: ${category}

${description}`;
}