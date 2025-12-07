import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase.from("products").select("*");

  console.log("Products:", data, error);

  return <div>Check your console!</div>;
}

