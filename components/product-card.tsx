"use client";

import Link from "next/link";
import { useState } from "react";
import AIChatModal from "./ai-chat-modal";

export type Product = {
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
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const [showChat, setShowChat] = useState(false);

  if (!product?.id) {
    console.warn("ProductCard: missing product.id", product);
    return null;
  }

  return (
    <>
      <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{product.name}</h2>

          <div className="space-y-1 text-sm">
            <p className="text-slate-600">
              Bank: <span className="font-medium">{product.bank ?? "N/A"}</span>
            </p>
            <p className="text-slate-600">
              APR: <span className="font-medium">{product.rate_apr ?? "N/A"}%</span>
            </p>
            <p className="text-slate-600">
              Min Income: <span className="font-medium">₹{product.min_income ?? 0}</span>
            </p>
            <p className="text-slate-600">
              Credit Score: <span className="font-medium">{product.min_credit_score ?? "N/A"}</span>
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <button
              className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setShowChat(true);
              }}
            >
              Ask about this product
            </button>
            <Link
              href={`/product/${product.id}`}
              className="text-sm text-blue-600 hover:text-blue-800 text-center"
            >
              View details
            </Link>
          </div>
        </div>
      </div>

      {showChat && (
        <AIChatModal
          productId={product.id}
          productName={product.name}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
}
