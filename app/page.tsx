// app/page.tsx
import TopProducts from "@/components/TopProducts";

export default async function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">Loan Products</h1>
              <p className="text-sm text-slate-600">Discover the best loan options tailored for you</p>
            </div>
            <div />
          </div>
        </header>

        {/* Top products block (keeps aligned inside same container) */}
        <div className="mb-8">
          <TopProducts />
        </div>
      </div>
    </main>
  );
}
