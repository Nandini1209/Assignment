// components/TopProducts.tsx
import React from "react";
import { supabaseServer } from "@/lib/supabase-server";

type Product = {
  id: string;
  name: string;
  bank: string | null;
  rate_apr: number | null;
  min_income: number | null;
  min_credit_score: number | null;
  tenure_min_months: number | null;
  tenure_max_months: number | null;
  summary?: string | null;
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full mr-2">
      {children}
    </span>
  );
}

export default async function TopProducts() {
  // fetch top 5 by lowest APR
  const { data: products, error } = await supabaseServer
  .from("products")
  .select("*")
  .order("rate_apr", { ascending: true })
  .limit(5);

  if (error) {
    console.error("TopProducts supabase error:", error);
    return (
      <div className="p-4 border rounded bg-red-50 text-red-700">
        Failed to load top products.
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-4 border rounded bg-yellow-50 text-yellow-800">
        No products found.
      </div>
    );
  }

  return (
    <section className="p-4 bg-white rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Top 5 Products (Low APR)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => {
          const apr = p.rate_apr ?? 0;
          const minCredit = p.min_credit_score ?? 9999;
          const tenureMin = p.tenure_min_months ?? 0;
          const tenureRange = (p.tenure_max_months ?? 0) - tenureMin;

          const badges = [
            apr <= 9.5 ? "Low APR" : null,
            tenureMin <= 6 ? "Fast disbursal" : null,
            tenureRange >= 48 ? "Flexible tenure" : null,
            minCredit <= 650 ? "Low credit req" : null,
          ].filter(Boolean) as string[];

          return (
            <article key={p.id} className="p-3 border rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <div className="text-xs text-slate-500">{p.bank}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold">{apr}% APR</div>
                  <div className="text-xs text-slate-600">
                    Credit: {p.min_credit_score ?? "—"}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                {p.summary ?? ""}
              </p>

              <div className="mt-3">
                {badges.length ? (
                  badges.map((b) => <Badge key={b}>{b}</Badge>)
                ) : (
                  <span className="text-xs text-slate-500">No special badges</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}