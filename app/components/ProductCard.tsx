// Carte produit utilisée dans la boutique (grilles, accueil).
import { Link } from "react-router";
import { categoryLabel } from "~/lib/categories";
import { useCart } from "~/lib/cart";
import { formatFcfa } from "~/lib/format";
import type { Product } from "~/lib/types";
import { ProductImage } from "./ProductImage";
import { Badge, Button, Card } from "./ui";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const outOfStock = product.stock <= 0;

  return (
    <Card className="group flex flex-col overflow-hidden">
      <Link
        to={`/product/${product.id}`}
        className="block aspect-square overflow-hidden bg-slate-100"
      >
        <ProductImage
          src={product.imageUrl}
          category={product.category}
          alt={product.name}
          className="transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <span className="mb-1 text-xs uppercase tracking-wide text-slate-400">
            {categoryLabel(product.category)}
          </span>
        )}
        <Link
          to={`/product/${product.id}`}
          className="font-medium text-slate-900 transition hover:text-indigo-600"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold text-slate-900">
            {formatFcfa(product.price)}
          </span>
          {outOfStock ? (
            <Badge tone="red">Rupture</Badge>
          ) : (
            <Badge tone="green">En stock</Badge>
          )}
        </div>
        <Button
          className="mt-3 w-full"
          size="sm"
          disabled={outOfStock}
          onClick={() => add(product)}
        >
          {outOfStock ? "Indisponible" : "Ajouter au panier"}
        </Button>
      </div>
    </Card>
  );
}
