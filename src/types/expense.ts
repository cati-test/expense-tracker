export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string; // ISO date string YYYY-MM-DD
}

export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Health",
  "Housing",
  "Utilities",
  "Travel",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_ICONS: Record<string, string> = {
  "Food & Dining": "🍽️",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Health: "💊",
  Housing: "🏠",
  Utilities: "💡",
  Travel: "✈️",
  Other: "📦",
};

export const CATEGORY_COLORS: Record<
  string,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  "Food & Dining": "warning",
  Transportation: "primary",
  Shopping: "secondary",
  Entertainment: "danger",
  Health: "success",
  Housing: "primary",
  Utilities: "default",
  Travel: "secondary",
  Other: "default",
};
