// app/page.tsx
import ProductsArea from "@/components/products-area";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  // server-side initial fetch for first render
  const { data: initialProducts, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Loan Products
          </h1>
          <p className="text-slate-600 mt-2">Discover the best loan options tailored for you</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ProductsArea initialProducts={initialProducts || []} />
      </div>
    </main>
  );
}

