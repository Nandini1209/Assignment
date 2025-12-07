

import ProductsArea from "@/components/products-area";
import { supabase } from "@/lib/supabase";


import TopProducts from "@/components/TopProducts";

export default async function Home() {
  
  const { data: initialProducts, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen">
      
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Loan Products
          </h1>
        </div>
      </header>

      
      <TopProducts />

      
      <ProductsArea initialProducts={initialProducts ?? []} />
    </main>
  );
}