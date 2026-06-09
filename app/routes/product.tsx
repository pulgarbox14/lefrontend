import { useState } from "react";
import { Link, useParams } from "react-router";
import { ProductImage } from "~/components/ProductImage";
import { Alert, Badge, Button, Spinner } from "~/components/ui";
import { useCrud } from "~/hooks/useCrud";
import { categoryLabel } from "~/lib/categories";
import { useCart } from "~/lib/cart";
import { formatFcfa } from "~/lib/format";
import type { Product } from "~/lib/types";

export function meta() {
  return [{ title: "MyShop — Produit" }];
}

export default function ProductRoute() {
  const { id } = useParams();
  const { items, loading, error } = useCrud<Product>("/products");
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-400">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Alert tone="error">{error}</Alert>
      </div>
    );
  }

  const product = items.find((p) => String(p.id) === id);

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="text-5xl">🔍</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Produit introuvable</h1>
        <p className="mt-2 text-slate-500">Ce produit n'existe pas ou n'est plus disponible.</p>
        <Link to="/shop" className="mt-6 inline-block">
          <Button>Retour à la boutique</Button>
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link to="/shop" className="text-sm text-slate-500 transition hover:text-slate-900">
        ← Retour à la boutique
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <ProductImage
            src={product.imageUrl}
            category={product.category}
            alt={product.name}
          />
        </div>

        <div>
          {product.category && (
            <span className="text-sm uppercase tracking-wide text-slate-400">
              {categoryLabel(product.category)}
            </span>
          )}
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-indigo-600">
            {formatFcfa(product.price)}
          </p>
          <div className="mt-3">
            {outOfStock ? (
              <Badge tone="red">Rupture de stock</Badge>
            ) : (
              <Badge tone="green">En stock ({product.stock})</Badge>
            )}
          </div>

          {product.description && (
            <p className="mt-5 leading-relaxed text-slate-600">{product.description}</p>
          )}

          {!outOfStock && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-lg border border-slate-300">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-lg text-slate-600 hover:bg-slate-100"
                  aria-label="Diminuer"
                >
                  −
                </button>
                <span className="w-10 text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2 text-lg text-slate-600 hover:bg-slate-100"
                  aria-label="Augmenter"
                >
                  +
                </button>
              </div>
              <Button onClick={handleAdd}>Ajouter au panier</Button>
            </div>
          )}

          {added && (
            <p className="mt-4 text-sm text-emerald-600">
              ✓ Ajouté au panier.{" "}
              <Link to="/cart" className="font-medium underline">
                Voir le panier
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
