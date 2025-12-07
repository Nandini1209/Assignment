// components/onboarding-form.tsx
"use client";

import { useState } from "react";

type Props = {
  onSubmit: (data: { income: string; occupation: string; purpose: string }) => Promise<void>;
  isLoading?: boolean;
};

export default function OnboardingForm({ onSubmit, isLoading }: Props) {
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!income.trim() || !occupation.trim() || !purpose.trim()) {
      return;
    }
    await onSubmit({ income: income.trim(), occupation: occupation.trim(), purpose: purpose.trim() });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">Help us find the best loans for you</h2>
      <p className="text-sm text-slate-600 mb-6">
        Answer a few quick questions to get personalized loan recommendations
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Income
          </label>
          <input
            type="text"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="e.g., ₹50,000 per month"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Occupation
          </label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="e.g., Software Engineer, Business Owner"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Loan Purpose
          </label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g., Home renovation, Education, Business expansion"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !income.trim() || !occupation.trim() || !purpose.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Getting recommendations..." : "Get Recommendations"}
        </button>
      </form>
    </div>
  );
}

