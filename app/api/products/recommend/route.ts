// app/api/products/recommend/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const RequestSchema = z.object({
  income: z.string().min(1),
  occupation: z.string().min(1),
  purpose: z.string().min(1),
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

    const { income, occupation, purpose } = parsed.data;

    // Fetch all products
    const supabase = await createClient();
    const { data: allProducts, error: pErr } = await supabase
      .from("products")
      .select("*");

    if (pErr || !allProducts || allProducts.length === 0) {
      return NextResponse.json(
        { error: "No products found" },
        { status: 404 }
      );
    }

    // Prepare product data for AI
    const productsSummary = allProducts.map((p) => ({
      id: p.id,
      name: p.name,
      bank: p.bank,
      type: p.type,
      rate_apr: p.rate_apr,
      min_income: p.min_income,
      min_credit_score: p.min_credit_score,
      tenure_min_months: p.tenure_min_months,
      tenure_max_months: p.tenure_max_months,
      summary: p.summary,
    }));

    // System prompt for AI
    const systemPrompt = `
You are a loan recommendation expert. Based on the user's profile and available loan products, recommend exactly 5 products that best match their needs.

User Profile:
- Income: ${income}
- Occupation: ${occupation}
- Loan Purpose: ${purpose}

Available Products:
${JSON.stringify(productsSummary, null, 2)}

Your task:
1. Analyze the user's profile and loan purpose
2. Match products based on eligibility (income, credit score requirements)
3. Consider loan type relevance (e.g., education loans for education, home loans for home renovation)
4. Consider APR and terms that suit the user's profile
5. Return exactly 5 product IDs in a JSON array, ordered by best match first

Return ONLY a JSON array of product IDs like: ["uuid1", "uuid2", "uuid3", "uuid4", "uuid5"]
Do not include any explanation or additional text.
    `.trim();

    // Call OpenAI
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Recommend 5 best loan products for me." },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!resp.ok) {
      const bodyText = await resp.text();
      console.error("OpenAI error:", bodyText);
      return NextResponse.json(
        { error: "Failed to get AI recommendations" },
        { status: 500 }
      );
    }

    const data = (await resp.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const aiResponse = data.choices?.[0]?.message?.content || "[]";
    
    // Parse AI response to get product IDs
    let productIds: string[] = [];
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(aiResponse);
      if (Array.isArray(parsed)) {
        productIds = parsed.filter((id) => typeof id === "string");
      } else if (typeof parsed === "string") {
        // Sometimes AI returns string representation
        productIds = JSON.parse(parsed);
      }
    } catch {
      // Fallback: extract UUIDs from response
      const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
      productIds = aiResponse.match(uuidRegex) || [];
    }

    // Ensure we have exactly 5 products (or as many as available)
    if (productIds.length === 0) {
      // Fallback: return top 5 by lowest APR
      const sorted = [...allProducts]
        .sort((a, b) => (a.rate_apr ?? 999) - (b.rate_apr ?? 999))
        .slice(0, 5);
      productIds = sorted.map((p) => p.id);
    } else {
      // Filter to valid product IDs and limit to 5
      const validIds = productIds.filter((id) =>
        allProducts.some((p) => p.id === id)
      );
      productIds = validIds.slice(0, 5);
      
      // If we have fewer than 5, fill with top APR products
      if (productIds.length < 5) {
        const existingIds = new Set(productIds);
        const remaining = allProducts
          .filter((p) => !existingIds.has(p.id))
          .sort((a, b) => (a.rate_apr ?? 999) - (b.rate_apr ?? 999))
          .slice(0, 5 - productIds.length)
          .map((p) => p.id);
        productIds = [...productIds, ...remaining];
      }
    }

    return NextResponse.json({
      productIds: productIds.slice(0, 5),
      userProfile: { income, occupation, purpose },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

