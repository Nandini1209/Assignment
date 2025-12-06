

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Body = { message?: string; productId?: string | null; userId?: string | null };

export async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const message = (body.message || "").toString().trim();
    const productId = body.productId ?? null;
    const userId = body.userId ?? null; // optional, if you track logged in user

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // 1) Optionally fetch product summary to give to the model
    let productSummary = "";
    if (productId) {
      const { data: productData, error: pErr } = await supabase
        .from("products")
        .select("id, name, summary, rate_apr, min_income")
        .eq("id", productId)
        .single();

      if (!pErr && productData) {
        productSummary = `Product: ${productData.name}\nAPR: ${productData.rate_apr}\nMinimum income: ${productData.min_income}\nSummary: ${productData.summary}`;
      }
    }

    // 2) Save user message to Supabase (role = user)
    await supabase.from("ai_chat_messages").insert({
      user_id: userId,
      product_id: productId,
      role: "user",
      content: message,
    });

    // 3) Create prompt for OpenAI (include product context)
    const systemPrompt = `You are a helpful assistant for a loans site. Answer concisely and include APR, eligibility or next steps when relevant. When product context is available include the product name and APR.`;

    const userPrompt = productSummary
      ? `Product context:\n${productSummary}\n\nUser question:\n${message}`
      : `User question:\n${message}`;

    // 4) Call OpenAI Chat Completions (gpt-5.1 or whichever engine)
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY missing on server" }, { status: 500 });
    }

    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.1", // change to model you have access to
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 600,
      }),
    });

    if (!openaiResp.ok) {
      const body = await openaiResp.text();
      console.error("OpenAI error:", openaiResp.status, body);
      return NextResponse.json({ error: "OpenAI request failed" }, { status: 500 });
    }

    const openaiJson = await openaiResp.json();
    // most responses: openaiJson.choices[0].message.content
    const assistantReply = openaiJson?.choices?.[0]?.message?.content?.trim() ?? "Sorry, I couldn't generate a reply.";

    // 5) Save assistant reply to Supabase
    await supabase.from("ai_chat_messages").insert({
      user_id: userId,
      product_id: productId,
      role: "assistant",
      content: assistantReply,
    });

    // 6) Return reply (and productSummary if needed by client)
    return NextResponse.json({ reply: assistantReply, productSummary });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
