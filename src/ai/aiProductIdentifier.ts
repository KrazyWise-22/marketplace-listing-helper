export async function aiIdentifyProduct(itemName: string) {
  const response = await fetch("/api/analyze-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemName,
    }),
  });

  if (!response.ok) {
    throw new Error("AI product identification failed.");
  }

  const data = await response.json();

  return data.result;
}