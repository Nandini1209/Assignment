// app/page.tsx
import ProductsArea from "@/components/products-area";

export default async function Home() {
  // server-side initial fetch for first render
  const res = await fetch("http://localhost:3000/api/products", { cache: "no-store" });
  const initialProducts = await res.json();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Loan Products</h1>
      <ProductsArea initialProducts={initialProducts} />
    </main>
  );
}
