// components/TopProducts.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import OnboardingForm from "./onboarding-form";
import type { UserPreferences } from "@/types/user-preferences";
import { STORAGE_KEY } from "@/types/user-preferences";

type ProductDisplay = {
  id: string;
  name: string;
  bank: string | null;
  rate_apr: number | null;
  min_income: number | null;
  min_credit_score: number | null;
  tenure_min_months: number | null;
  tenure_max_months: number | null;
  summary: string | null;
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full mr-2">
      {children}
    </span>
  );
}

function BestMatchBadge() {
  return (
    <span className="inline-block text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full mr-2">
      Best Match
    </span>
  );
}

export default function TopProducts() {
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null);
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const prefs = JSON.parse(stored) as UserPreferences;
        setUserPrefs(prefs);
        setShowForm(false);
        loadRecommendedProducts(prefs.recommendedProductIds);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        loadDefaultProducts();
      }
    } else {
      setShowForm(true);
      loadDefaultProducts();
    }
  }, []);

  const loadDefaultProducts = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("rate_apr", { ascending: true })
        .limit(5);

      if (!error && data) {
        setProducts(data as ProductDisplay[]);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecommendedProducts = async (productIds: string[]) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (!error && data) {
        // Sort products to match the recommended order
        const sorted = productIds
          .map((id) => data.find((p) => p.id === id))
          .filter((p): p is ProductDisplay => p !== undefined);
        setProducts(sorted);
      } else {
        // Fallback to default if error
        await loadDefaultProducts();
      }
    } catch (err) {
      console.error("Error loading recommended products:", err);
      await loadDefaultProducts();
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData: {
    income: string;
    occupation: string;
    purpose: string;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/products/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = (await response.json()) as {
        productIds: string[];
        userProfile: { income: string; occupation: string; purpose: string };
      };

      const prefs: UserPreferences = {
        ...data.userProfile,
        recommendedProductIds: data.productIds,
        timestamp: Date.now(),
      };

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      setUserPrefs(prefs);
      setShowForm(false);
      await loadRecommendedProducts(data.productIds);
    } catch (err) {
      console.error("Error getting recommendations:", err);
      alert("Failed to get recommendations. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetMoreSuggestions = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserPrefs(null);
    setProducts([]);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <section className="p-4 bg-white rounded-md shadow-sm">
        <OnboardingForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="p-4 bg-white rounded-md shadow-sm">
        <div className="text-center py-8">
          <p className="text-slate-600">Loading recommendations...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="p-4 bg-white rounded-md shadow-sm">
        <div className="text-center py-8">
          <p className="text-slate-600">No products available.</p>
          <button
            onClick={handleGetMoreSuggestions}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Get Recommendations
          </button>
        </div>
      </section>
    );
  }

  const title = userPrefs ? "Top 5 Products (Recommended for You)" : "Top 5 Products (Low APR)";

  return (
    <section className="p-4 bg-white rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {userPrefs && (
          <button
            onClick={handleGetMoreSuggestions}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Get new suggestions
          </button>
        )}
      </div>

      {userPrefs && (
        <div className="text-xs text-slate-600 mb-4">
          Based on: {userPrefs.occupation} • {userPrefs.purpose}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p, index) => {
          const apr = p.rate_apr ?? 0;
          const minCredit = p.min_credit_score ?? 9999;
          const tenureMin = p.tenure_min_months ?? 0;
          const tenureRange = (p.tenure_max_months ?? 0) - tenureMin;
          const isBestMatch = userPrefs && index === 0;

          const badges = [
            isBestMatch ? null : null, // Best Match badge will be added separately
            apr <= 9.5 ? "Low APR" : null,
            tenureMin <= 6 ? "Fast disbursal" : null,
            tenureRange >= 48 ? "Flexible tenure" : null,
            minCredit <= 650 ? "Low credit req" : null,
          ].filter(Boolean) as string[];

          return (
            <article key={p.id} className={`p-3 border rounded ${isBestMatch ? "ring-2 ring-green-500" : ""}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <div className="text-xs text-slate-500">{p.bank}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold">{apr}% APR</div>
                  <div className="text-xs text-slate-600">
                    Credit: {p.min_credit_score ?? "—"}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                {p.summary ?? ""}
              </p>

              <div className="mt-3">
                {isBestMatch && <BestMatchBadge />}
                {badges.length > 0 ? (
                  badges.map((b) => <Badge key={b}>{b}</Badge>)
                ) : (
                  !isBestMatch && <span className="text-xs text-slate-500">No special badges</span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t">
                <Link
                  href={`/product/${p.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 text-center block"
                >
                  View details
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Prominent CTA Section */}
      <div className="mt-8 pt-6 border-t">
        <div className="text-center">
          <p className="text-slate-700 mb-4 text-sm md:text-base">
            Want to explore more options? Check out all the loan products we have to offer
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base shadow-md hover:shadow-lg"
          >
            See All Loan Products
          </Link>
        </div>
      </div>
    </section>
  );
}