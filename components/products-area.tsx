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
      <section className="mb-6 p-4 border rounded-md">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium">Bank</label>
            <select className="w-full mt-1 p-2 border rounded" value={bank} onChange={(e) => setBank(e.target.value)}>
              {banks.map((b) => <option key={b} value={b}>{b || "Any bank"}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Type</label>
            <select className="mt-1 p-2 border rounded" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              {types.map((t) => <option key={t} value={t}>{t || "Any type"}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Max APR</label>
            <input
              type="number"
              className="mt-1 p-2 border rounded w-28"
              value={maxApr}
              onChange={(e) => setMaxApr(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Min Credit Score</label>
            <input
              type="number"
              className="mt-1 p-2 border rounded w-28"
              value={minCredit}
              onChange={(e) => setMinCredit(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 650"
            />
          </div>

          <div>
            <button
              type="button"
              className="mt-1 px-4 py-2 bg-gray-200 rounded"
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

      <section>
        {products.length === 0 ? (
          <div className="text-center text-gray-600">No products match your filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p: Product) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
