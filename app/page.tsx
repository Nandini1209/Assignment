// app/page.tsx
import TopProducts from "@/components/TopProducts";
import ProductsArea from "@/components/products-area";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  // keep generic-free to avoid "expected 2 type args" issues
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
              <h1 className="text-3xl sm:text-4xl font-extrabold">Loan Products</h1>
              <p className="text-sm text-slate-600">Discover the best options tailored for you</p>
            </div>
            <div />
          </div>
        </header>

        {/* Top products block (keeps aligned inside same container) */}
        <div className="mb-8">
          <TopProducts />
        </div>

        {/* Filters + product grid */}
        <ProductsArea initialProducts={products} />
      </div>
    </main>
  );
}
