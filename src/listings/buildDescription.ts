import type { FormData } from "../types/listing";

export function buildDescription(
  form: FormData,
  category: string
) {
  const details = form.details.trim();

  if (details) {
    return details;
  }

  return [
    `${form.itemName} is in ${form.condition.toLowerCase()} condition.`,
    "Ready for its next owner.",
    `Listed in the ${category} category.`,
    "Message me if you have any questions.",
  ].join(" ");
}