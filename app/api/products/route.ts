// app/api/products/route.ts
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const bank = url.searchParams.get("bank");
    const type = url.searchParams.get("type");
    const max_apr = url.searchParams.get("max_apr");
    const min_credit_score = url.searchParams.get("min_credit_score");

    let query = supabase.from("products").select("*");

    if (bank) {
      query = query.eq("bank", bank);
    }
    if (type) {
      query = query.eq("type", type);
    }
    if (max_apr) {
      // allow filtering by maximum APR
      const aprNum = Number(max_apr);
      if (!Number.isNaN(aprNum)) query = query.lte("rate_apr", aprNum);
    }
    if (min_credit_score) {
      const minScore = Number(min_credit_score);
      if (!Number.isNaN(minScore)) query = query.gte("min_credit_score", minScore);
    }

    const { data, error } = await query.order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

