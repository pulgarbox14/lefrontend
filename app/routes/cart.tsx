import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ProductImage } from "~/components/ProductImage";
import { Alert, Button, Card, EmptyState } from "~/components/ui";
import { api, apiErrorMessage } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { useCart } from "~/lib/cart";
import { formatFcfa } from "~/lib/format";

export function meta() {
  return [{ title: "MyShop — Panier" }];
}

export default function CartRoute() {
  const { items, total, count, setQuantity, remove, clear } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const checkout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setPlacing(true);
    setError(null);
    try {
      await api.post("/orders", {
        customerName: user?.name || user?.email || "Client",
        quantity: count,
        totalPrice: total,
      });
      clear();
      setDone(true);
    } catch (err) {
      setError(apiErrorMessage(err, "La commande a échoué."));
    } finally {
      setPlacing(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Commande passée !</h1>
        <p className="mt-2 text-slate-500">
          Merci pour ton achat. Tu peux suivre ta commande dans ton compte.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/shop">
            <Button variant="secondary">Continuer mes achats</Button>
          </Link>
          <Link to="/account">
            <Button>Mes commandes</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <EmptyState
          icon="🛒"
          title="Ton panier est vide"
          description="Parcours la boutique et ajoute tes articles préférés."
        />
        <div className="mt-4 flex justify-center">
          <Link to="/shop">
            <Button>Aller à la boutique</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Mon panier</h1>
      {error && (
        <div className="mt-4">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {items.map(({ product, quantity }) => (
          <Card key={product.id} className="flex items-center gap-4 p-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <ProductImage
                src={product.imageUrl}
                category={product.category}
                alt={product.name}
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                to={`/product/${product.id}`}
                className="block truncate font-medium text-slate-900 hover:text-indigo-600"
              >
                {product.name}
              </Link>
              <p className="text-sm text-slate-500">{formatFcfa(product.price)}</p>
            </div>
            <div className="flex items-center rounded-lg border border-slate-300">
              <button
                type="button"
                onClick={() => setQuantity(product.id, quantity - 1)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100"
                aria-label="Diminuer"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(product.id, quantity + 1)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100"
                aria-label="Augmenter"
              >
                +
              </button>
            </div>
            <div className="hidden w-24 text-right font-semibold text-slate-900 sm:block">
              {formatFcfa(product.price * quantity)}
            </div>
            <button
              type="button"
              onClick={() => remove(product.id)}
              className="text-slate-400 transition hover:text-red-600"
              aria-label="Retirer"
            >
              ✕
            </button>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between text-lg">
          <span className="text-slate-600">Total</span>
          <span className="font-bold text-slate-900">{formatFcfa(total)}</span>
        </div>
        <Button className="mt-4 w-full" loading={placing} onClick={checkout}>
          {isAuthenticated ? "Passer la commande" : "Se connecter pour commander"}
        </Button>
      </Card>
    </div>
  );
}
