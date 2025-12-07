"use client";

import { useState } from "react";
import AIChatModal from "./ai-chat-modal";
import type { Product, FAQ, ProductDescription } from "@/types/product";
import { isFAQItem, isFAQArray, isFAQString } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductDetailsClient({ product }: Props) {
  const [showChat, setShowChat] = useState(false);

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonths = (months: number | null) => {
    if (months === null || months === undefined) return "N/A";
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years > 1 ? "s" : ""}`;
    return `${years} year${years > 1 ? "s" : ""} ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
  };

  // Helper to safely render text content (handles strings, objects, arrays)
  const renderTextContent = (content: ProductDescription): string => {
    if (!content) return "";
    if (typeof content === "string") return content;
    if (typeof content === "object" && content !== null) {
      // If it's an array, join it
      if (Array.isArray(content)) {
        return content.map((item) => {
          if (typeof item === "string") return item;
          if (isFAQItem(item)) {
            return `Q: ${item.q}\nA: ${item.a}`;
          }
          if (typeof item === "object" && item !== null) {
            return JSON.stringify(item);
          }
          return String(item);
        }).join("\n\n");
      }
      // If it's an object with q and a keys
      if (isFAQItem(content)) {
        return `Q: ${content.q}\nA: ${content.a}`;
      }
      // Otherwise stringify
      return JSON.stringify(content);
    }
    return String(content);
  };

  // Helper to render FAQ (handles different formats)
  const renderFAQ = (faq: FAQ): JSX.Element | null => {
    if (!faq) return null;

    // If it's a string, render it directly
    if (isFAQString(faq)) {
      return (
        <div className="text-slate-700 leading-relaxed whitespace-pre-line">
          {faq}
        </div>
      );
    }

    // If it's an array of FAQ items
    if (isFAQArray(faq)) {
      return (
        <div className="space-y-4">
          {faq.map((item, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <h3 className="font-semibold text-slate-900 mb-2">Q: {item.q}</h3>
              <p className="text-slate-700 leading-relaxed">A: {item.a}</p>
            </div>
          ))}
        </div>
      );
    }

    // If it's a single FAQ item object
    if (isFAQItem(faq)) {
      return (
        <div className="border-b pb-4">
          <h3 className="font-semibold text-slate-900 mb-2">Q: {faq.q}</h3>
          <p className="text-slate-700 leading-relaxed">A: {faq.a}</p>
        </div>
      );
    }

    // Fallback for unexpected types
    return (
      <div className="text-slate-700 leading-relaxed whitespace-pre-line">
        {JSON.stringify(faq, null, 2)}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
              <p className="text-lg text-slate-600">{product.bank || "N/A"}</p>
            </div>
            {product.type && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {product.type}
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 rounded-lg p-4 border">
            <p className="text-sm text-slate-600 mb-1">APR</p>
            <p className="text-2xl font-bold text-slate-900">
              {product.rate_apr !== null ? `${product.rate_apr}%` : "N/A"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border">
            <p className="text-sm text-slate-600 mb-1">Min Income</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(product.min_income)}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border">
            <p className="text-sm text-slate-600 mb-1">Min Credit Score</p>
            <p className="text-2xl font-bold text-slate-900">
              {product.min_credit_score ?? "N/A"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border">
            <p className="text-sm text-slate-600 mb-1">Tenure</p>
            <p className="text-lg font-bold text-slate-900">
              {product.tenure_min_months !== null && product.tenure_max_months !== null
                ? `${formatMonths(product.tenure_min_months)} - ${formatMonths(product.tenure_max_months)}`
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Summary */}
        {product.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Overview</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {renderTextContent(product.summary)}
            </p>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Description</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {renderTextContent(product.description)}
            </p>
          </div>
        )}

        {/* FAQ */}
        {product.faq && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Frequently Asked Questions</h2>
            {renderFAQ(product.faq)}
          </div>
        )}

        {/* Eligibility Requirements */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Eligibility Requirements</h2>
          <div className="bg-slate-50 rounded-lg p-6 border">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Minimum Credit Score:</span>
                <span className="font-semibold text-slate-900">
                  {product.min_credit_score ?? "Not specified"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Minimum Income:</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(product.min_income)}
                </span>
              </div>
              {product.bank && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Bank:</span>
                  <span className="font-semibold text-slate-900">{product.bank}</span>
                </div>
              )}
              {product.type && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Loan Type:</span>
                  <span className="font-semibold text-slate-900">{product.type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loan Terms */}
        {(product.tenure_min_months !== null || product.tenure_max_months !== null) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Loan Terms</h2>
            <div className="bg-slate-50 rounded-lg p-6 border">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Tenure Range:</span>
                  <span className="font-semibold text-slate-900">
                    {product.tenure_min_months !== null && product.tenure_max_months !== null
                      ? `${formatMonths(product.tenure_min_months)} - ${formatMonths(product.tenure_max_months)}`
                      : product.tenure_min_months !== null
                      ? `From ${formatMonths(product.tenure_min_months)}`
                      : product.tenure_max_months !== null
                      ? `Up to ${formatMonths(product.tenure_max_months)}`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Interest Rate (APR):</span>
                  <span className="font-semibold text-slate-900">
                    {product.rate_apr !== null ? `${product.rate_apr}%` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-8 pt-6 border-t">
          <button
            onClick={() => setShowChat(true)}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Ask about this product
          </button>
        </div>
      </div>

      {showChat && (
        <AIChatModal
          productId={product.id}
          productName={product.name}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
}

