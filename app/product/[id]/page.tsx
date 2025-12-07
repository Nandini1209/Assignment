// app/product/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductDetailsClient from "@/components/product-details-client";
import type { Product } from "@/types/product";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  // Fetch product details
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  // Type assertion for product data from Supabase
  const typedProduct = product as Product;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          ← Back to all products
        </Link>

        {/* Product Details */}
        <ProductDetailsClient product={typedProduct} />
      </div>
    </main>
  );
}

