import type { FormData } from "../types/listing";

export function buildDescription(
  form: FormData,
  category: string
) {
  const details = form.details.trim();

  if (details) {
    return details;
  }

  return `Listed in the ${category} category.`;
}