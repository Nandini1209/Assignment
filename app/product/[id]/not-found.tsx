import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Product Not Found</h1>
        <p className="text-slate-600 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to all products
        </Link>
      </div>
    </main>
  );
}

