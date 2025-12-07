// app/products/page.tsx
import Link from "next/link";
import ProductsArea from "@/components/products-area";
import { createClient } from "@/lib/supabase/server";

export default async function AllProductsPage() {
  // Fetch all products
  const supabase = await createClient();
  const { data: initialProducts, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  const products = error ? [] : initialProducts ?? [];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">All Loan Products</h1>
              <p className="text-sm text-slate-600">Browse all available loan options</p>
            </div>
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to home
            </Link>
          </div>
        </header>

        {/* Filters + product grid */}
        <ProductsArea initialProducts={products} />
      </div>
    </main>
  );
}

