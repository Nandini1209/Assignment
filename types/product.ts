// types/product.ts

// FAQ can be in different formats
export type FAQItem = {
  q: string;
  a: string;
};

export type FAQ = 
  | string 
  | FAQItem 
  | FAQItem[] 
  | null;

// Description can be string or object
export type ProductDescription = 
  | string 
  | Record<string, unknown> 
  | null 
  | undefined;

// Full product type
export type Product = {
  id: string;
  name: string;
  bank: string | null;
  type: string | null;
  rate_apr: number | null;
  min_income: number | null;
  min_credit_score: number | null;
  tenure_min_months: number | null;
  tenure_max_months: number | null;
  summary: string | null;
  faq: FAQ;
  description?: ProductDescription;
};

// Type guard functions
export function isFAQItem(value: unknown): value is FAQItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "q" in value &&
    "a" in value &&
    typeof (value as FAQItem).q === "string" &&
    typeof (value as FAQItem).a === "string"
  );
}

export function isFAQArray(value: unknown): value is FAQItem[] {
  return Array.isArray(value) && value.every(isFAQItem);
}

export function isFAQString(value: unknown): value is string {
  return typeof value === "string";
}

