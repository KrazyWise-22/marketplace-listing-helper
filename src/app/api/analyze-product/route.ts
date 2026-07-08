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

    const body = await req.json();

    const itemName = body.itemName;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: `
You are a product identification engine.

Analyze the following marketplace item.

Item:
${itemName}

Return ONLY valid JSON.

{
  "productName": "",
  "brand": "",
  "model": "",
  "category": "",
  "subcategory": "",
  "conditionAssumption": "Unknown",
  "estimatedRetailLow": 0,
  "estimatedRetailHigh": 0,
  "confidence": 0,
  "specifications": [],
  "summary": ""
}

Rules:

- Never explain.
- Never use markdown.
- Never wrap the JSON in code fences.
- If the brand is unknown, use null.
- If the model is unknown, use null.
- Confidence must be between 0 and 1.
- Retail values must be numbers.
- Specifications should be short bullet-style strings.
- Summary should be one concise paragraph describing what the product is and what it does.
`
    });

    return NextResponse.json({
      success: true,
      result: response.output_text,
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