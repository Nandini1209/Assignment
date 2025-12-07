// app/products/[id]/page.tsx
import { supabase } from "@/lib/supabase";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params?.id;

  // Guard if id is missing
  if (!id) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold">Invalid Product ID</h1>
        <p>No product id found in the URL.</p>
      </main>
    );
  }

  // Fetch single product by id from Supabase
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold">Product Not Found</h1>
        <p>{error?.message ?? "No product data returned."}</p>
      </main>
    );
  }

  // Render product details
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>

      <p><strong>Bank:</strong> {data.bank}</p>
      <p><strong>APR:</strong> {data.rate_apr}%</p>
      <p><strong>Minimum Income:</strong> {data.min_income ?? "N/A"}</p>
      <p><strong>Credit Score:</strong> {data.min_credit_score ?? "N/A"}</p>

      <p className="mt-4 text-slate-700">{data.description}</p>
    </main>
  );
}