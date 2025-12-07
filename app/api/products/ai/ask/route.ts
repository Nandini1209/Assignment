// app/api/products/ai/ask/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";

const RequestSchema = z.object({
  productId: z.string().uuid(),
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const { productId, message, history = [] } = parsed.data;

    // Fetch product
    const { data: productData, error: pErr } = await supabaseServer
      .from("products")
      .select(
        "id, name, bank, type, rate_apr, min_income, min_credit_score, tenure_min_months, tenure_max_months, summary, faq"
      )
      .eq("id", productId)
      .single();

    if (pErr || !productData) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // System message + grounding
    const systemPrompt = `
You are a helpful assistant. 
Only answer questions using the product data provided below. 
If the answer is not in the product data, say "I don't have that information."
Keep responses short and factual.
    `.trim();

    const productBlock = `PRODUCT_DATA: ${JSON.stringify(productData)}`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: productBlock },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: message },
    ];

    // Call OpenAI
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages,
        max_tokens: 500,
        temperature: 0,
      }),
    });

    if (!resp.ok) {
      const bodyText = await resp.text();
      console.error("OpenAI error:", bodyText);
      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: 500 }
      );
    }

    const data = await resp.json();
    const assistantMsg =
      data.choices?.[0]?.message?.content || "No answer available.";

    return NextResponse.json({ answer: assistantMsg, product: productData });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}