// components/product-card.tsx
"use client";

import React from "react";


export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p className="text-gray-600">{product.bank}</p>

      <p className="mt-2">
        <span className="font-semibold">APR:</span> {product.rate_apr}%
      </p>

      <p>
        <span className="font-semibold">Min Income:</span> ₹
        {product.min_income.toLocaleString("en-IN")}
      </p>

      <p>
        <span className="font-semibold">Credit Score:</span>{" "}
        {product.min_credit_score}
      </p>

      <p className="mt-2 text-sm text-gray-700">{product.summary}</p>
    </div>
  );
}