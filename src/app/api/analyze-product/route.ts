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
      input: `Identify this marketplace item:

${itemName}

Return JSON only:
{
  "brand": "",
  "category": "",
  "productType": "",
  "specifications": [],
  "estimatedRetailRange": ""
}`
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