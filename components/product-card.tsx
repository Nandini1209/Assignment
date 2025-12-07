// components/product-card.tsx
"use client";
import React, { useState } from "react";
import ChatSheet from "@/components/chat-sheet"; // adjust path if needed

export default function ProductCard({ product }: { product: any }) {
  const [openChat, setOpenChat] = useState(false);

  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <h3 className="text-xl font-semibold">{product.name}</h3>
      <p className="text-sm text-slate-600">{product.bank}</p>

      <div className="mt-2 text-sm">
        <div>APR: {product.rate_apr}%</div>
        <div>Min Income: ₹{product.min_income ?? 0}</div>
        <div>Credit Score: {product.min_credit_score}</div>
      </div>

      <p className="mt-2 text-sm text-slate-500">{product.summary}</p>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setOpenChat(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Ask about this product
        </button>

        <a
          className="border rounded px-3 py-2"
          href={`/products/${product.id}`}
        >
          View details
        </a>
      </div>

      {/* ChatSheet modal/sheet */}
      {openChat && (
        <ChatSheet
          productId={product.id}
          productName={product.name}
          onClose={() => setOpenChat(false)}
        />
      )}
    </div>
  );
}