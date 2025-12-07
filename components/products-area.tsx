// components/products-area.tsx
"use client";

import React, { useMemo, useState } from "react";
import ProductCard from "@/components/product-card";

type Product = {
  id: string;
  name: string;        // remove ?
  apr: number;         // remove ?
  bank: string;        // remove ? if your ProductCard expects this
  description?: string; // keep optional if ProductCard doesn’t require
};

type Props = {
  initialProducts: Product[];
};

export default function ProductsArea({ initialProducts }: Props) {
  // simple filter state (expand as needed)
  const [maxApr, setMaxApr] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // filtered list memoized
  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      if (!p) return false;
      if (maxApr !== null && p.apr !== undefined && p.apr > maxApr) return false;
      if (search && p.name && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [initialProducts, maxApr, search]);

  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border rounded-md p-4 shadow-sm sticky top-6">
            <h3 className="font-semibold mb-3">Filters</h3>

            <label className="block text-sm mb-2">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm mb-4"
              placeholder="Search product name..."
            />

            <label className="block text-sm mb-2">Max APR</label>
            <input
              type="number"
              value={maxApr ?? ""}
              onChange={(e) => setMaxApr(e.target.value ? Number(e.target.value) : null)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="e.g. 10"
            />

            <button
              onClick={() => {
                setMaxApr(null);
                setSearch("");
              }}
              className="mt-4 w-full bg-slate-100 text-sm px-3 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </aside>

        {/* Product grid */}
        <main className="flex-1">
          <div className="mb-4 text-sm text-slate-600">
            Showing {filtered.length} of {initialProducts.length} products
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </main>
      </div>
    </section>
  );
}