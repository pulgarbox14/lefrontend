import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { ProductCard } from "~/components/ProductCard";
import { Alert, Spinner, TextInput, cn } from "~/components/ui";
import { useCrud } from "~/hooks/useCrud";
import { CATEGORIES } from "~/lib/categories";
import type { Product } from "~/lib/types";

export function meta() {
  return [{ title: "MyShop — Boutique" }];
}

export default function ShopRoute() {
  const { items, loading, error } = useCrud<Product>("/products");
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "";
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      items.filter((p) => {
        const okCategory = !category || p.category === category;
        const okSearch =
          !search || p.name.toLowerCase().includes(search.toLowerCase());
        return okCategory && okSearch;
      }),
    [items, category, search],
  );

  const selectCategory = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug) next.set("category", slug);
    else next.delete("category");
    setParams(next, { replace: true });
  };

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-1.5 text-sm font-medium transition",
      active
        ? "border-indigo-600 bg-indigo-600 text-white"
        : "border-slate-300 text-slate-600 hover:bg-slate-100",
    );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Boutique</h1>

      {/* Filtres */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => selectCategory("")} className={chip(!category)}>
          Tout
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => selectCategory(cat.slug)}
            className={chip(category === cat.slug)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
        <div className="ml-auto w-full sm:w-64">
          <TextInput
            placeholder="Rechercher un article…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grille */}
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-16 text-slate-400">
            <Spinner className="h-6 w-6" />
          </div>
        ) : error ? (
          <Alert tone="error">{error}</Alert>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-slate-500">
            Aucun produit ne correspond à ta recherche.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
