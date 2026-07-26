import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "OPENAI_API_KEY not configured",
        },
        {
          status: 500,
        }
      );
    }

    const openai = new OpenAI({
      apiKey,
    });

    const form = await req.json();

    const response = await openai.responses.create({
      model: "gpt-5",
      input: `
You are an expert product identification engine.

Your ONLY job is to identify the product.

Seller Information:

${JSON.stringify(form, null, 2)}

Return ONLY valid JSON.

{
  "productName": "",
  "brand": null,
  "model": null,
  "category": "",
  "subcategory": "",
  "conditionAssumption": "",
  "estimatedRetailLow": 0,
  "estimatedRetailHigh": 0,
  "confidence": 0,
  "specifications": [],
  "summary": ""
}
`,
    });

    let analysis;

    try {
      analysis = JSON.parse(response.output_text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "AI returned invalid JSON.",
          raw: response.output_text,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      result: analysis,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze item",
      },
      {
        status: 500,
      }
    );
  }
}