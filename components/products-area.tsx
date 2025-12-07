// components/products-area.tsx
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";

type Product = any;

export default function ProductsArea({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [bank, setBank] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [maxApr, setMaxApr] = useState<number | "">("");
  const [minCredit, setMinCredit] = useState<number | "">("");

  // optional: banks and types could be derived from API. For simplicity we use a small static list
  const banks = ["", "HDFC Bank", "State Bank of India", "Axis Bank", "ICICI Bank", "Kotak Mahindra Bank", "Bajaj Finance", "Punjab National Bank", "HDB Finance", "IDFC First Bank"];
  const types = ["", "personal", "education", "vehicle", "home", "credit_line", "debt_consolidation"];

  useEffect(() => {
    // fetch whenever filters change
    const controller = new AbortController();
    const qs = new URLSearchParams();
    if (bank) qs.set("bank", bank);
    if (typeFilter) qs.set("type", typeFilter);
    if (maxApr !== "") qs.set("max_apr", String(maxApr));
    if (minCredit !== "") qs.set("min_credit_score", String(minCredit));

    fetch(`/api/products?${qs.toString()}`, { signal: controller.signal, cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setProducts(data || []))
      .catch((e) => {
        if (e.name !== "AbortError") console.error("fetch error", e);
      });

    return () => controller.abort();
  }, [bank, typeFilter, maxApr, minCredit]);

  return (
    <div>
      {/* Filters Section */}
      <section className="mb-8 p-6 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Filter Products</h2>
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bank</label>
            <select 
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              value={bank} 
              onChange={(e) => setBank(e.target.value)}
            >
              {banks.map((b) => <option key={b} value={b}>{b || "Any bank"}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
            <select 
              className="px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {types.map((t) => <option key={t} value={t}>{t || "Any type"}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Max APR (%)</label>
            <input
              type="number"
              className="px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={maxApr}
              onChange={(e) => setMaxApr(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Min Credit Score</label>
            <input
              type="number"
              className="px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={minCredit}
              onChange={(e) => setMinCredit(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 650"
            />
          </div>

          <div>
            <button
              type="button"
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors duration-200 shadow-sm"
              onClick={() => {
                setBank("");
                setTypeFilter("");
                setMaxApr("");
                setMinCredit("");
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section>
        {products.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl">
            <p className="text-slate-500 text-lg">No products match your filters.</p>
            <p className="text-slate-400 text-sm mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p: Product) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
