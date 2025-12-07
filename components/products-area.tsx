// components/products-area.tsx
"use client";

import React, { useMemo, useState } from "react";
import ProductCard from "@/components/product-card";

type Product = {
  id: string;
  name: string;
  bank?: string;
  type?: string;
  rate_apr?: number;
  min_income?: number;
  min_credit_score?: number;
  description?: string;
};

type Props = {
  initialProducts: Product[];
};

export default function ProductsArea({ initialProducts }: Props) {
  const [bank, setBank] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [maxApr, setMaxApr] = useState<string>("");
  const [minCreditScore, setMinCreditScore] = useState<string>("");

  // Get unique banks and types for dropdowns
  const banks = useMemo(() => {
    const uniqueBanks = new Set(initialProducts.map((p) => p.bank).filter(Boolean));
    return Array.from(uniqueBanks).sort();
  }, [initialProducts]);

  const types = useMemo(() => {
    const uniqueTypes = new Set(initialProducts.map((p) => p.type).filter(Boolean));
    return Array.from(uniqueTypes).sort();
  }, [initialProducts]);

  // filtered list memoized
  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      if (!p) return false;
      if (bank && p.bank !== bank) return false;
      if (type && p.type !== type) return false;
      if (maxApr) {
        const aprNum = Number(maxApr);
        if (!Number.isNaN(aprNum) && (p.rate_apr ?? 0) > aprNum) return false;
      }
      if (minCreditScore) {
        const minScore = Number(minCreditScore);
        if (!Number.isNaN(minScore) && (p.min_credit_score ?? 9999) > minScore) return false;
      }
      return true;
    });
  }, [initialProducts, bank, type, maxApr, minCreditScore]);

  return (
    <section className="max-w-7xl mx-auto px-6">
      {/* Horizontal filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm mb-1 text-slate-700">Bank</label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm bg-white"
          >
            <option value="">Any bank</option>
            {banks.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm mb-1 text-slate-700">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm bg-white"
          >
            <option value="">Any type</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm mb-1 text-slate-700">Max APR</label>
          <input
            type="number"
            value={maxApr}
            onChange={(e) => setMaxApr(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="e.g. 12"
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm mb-1 text-slate-700">Min Credit Score</label>
          <input
            type="number"
            value={minCreditScore}
            onChange={(e) => setMinCreditScore(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="e.g. 600"
          />
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-8 bg-white border rounded">
            No products match your filters.
          </div>
        ) : (
          filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
}