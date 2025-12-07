"use client";

import Link from "next/link";

export type Product = {
  id: string;
  name: string;
  apr?: number;
  bank?: string;
  description?: string;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  if (!product?.id) {
    console.warn("ProductCard: missing product.id", product);
    return null;
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="block border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{product.name}</h2>

        <p className="text-slate-600 text-sm">
          APR: <span className="font-medium">{product.apr ?? "N/A"}%</span>
        </p>

        {product.bank && <p className="text-xs text-slate-500">Bank: {product.bank}</p>}

        <button
          className="mt-3 w-fit px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={(e) => e.preventDefault()} // prevent double navigation inside Link
        >
          View Details
        </button>
      </div>
    </Link>
  );
}
