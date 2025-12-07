// types/user-preferences.ts
export type UserPreferences = {
  income: string;
  occupation: string;
  purpose: string;
  recommendedProductIds: string[];
  timestamp: number;
};

export const STORAGE_KEY = "loan_user_preferences";

