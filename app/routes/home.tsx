import { Link } from "react-router";
import { ProductCard } from "~/components/ProductCard";
import { Alert, Spinner } from "~/components/ui";
import { useCrud } from "~/hooks/useCrud";
import { CATEGORIES } from "~/lib/categories";
import type { Product } from "~/lib/types";

export function meta() {
  return [
    { title: "MyShop — Mode, vêtements, chaussures & accessoires" },
    {
      name: "description",
      content:
        "Boutique en ligne de mode : vêtements, chaussures et accessoires tendance livrés chez toi.",
    },
  ];
}

export default function HomeRoute() {
  const { items, loading, error } = useCrud<Product>("/products");
  const featured = items.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            La mode à portée de clic
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
            Vêtements, chaussures et accessoires tendance, livrés chez toi.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
          >
            Découvrir la boutique
          </Link>
        </div>
      </section>

      {/* Catégories */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Catégories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="font-medium text-slate-700">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Nouveautés */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Nouveautés</h2>
          <Link
            to="/shop"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Tout voir
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 text-slate-400">
            <Spinner className="h-6 w-6" />
          </div>
        ) : error ? (
          <Alert tone="error">{error}</Alert>
        ) : featured.length === 0 ? (
          <p className="py-16 text-center text-slate-500">
            Aucun produit disponible pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
