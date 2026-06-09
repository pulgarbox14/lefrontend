// Catégories de la boutique de mode.

export interface Category {
  slug: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { slug: "vetements", label: "Vêtements", emoji: "👕" },
  { slug: "chaussures", label: "Chaussures", emoji: "👟" },
  { slug: "accessoires", label: "Accessoires", emoji: "👜" },
  { slug: "mode", label: "Mode", emoji: "🧥" },
];

export const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({
  value: c.slug,
  label: c.label,
}));

export function categoryLabel(slug?: string): string {
  if (!slug) return "Autres";
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function categoryEmoji(slug?: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.emoji ?? "🛍️";
}
