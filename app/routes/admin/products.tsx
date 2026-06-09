import { CrudPage } from "~/components/CrudPage";
import { Badge } from "~/components/ui";
import { CATEGORY_OPTIONS, categoryLabel } from "~/lib/categories";
import { formatFcfa } from "~/lib/format";
import type { Product } from "~/lib/types";

export function meta() {
  return [{ title: "MyShop Admin — Produits" }];
}

export default function AdminProductsRoute() {
  return (
    <CrudPage<Product>
      title="Produits"
      subtitle="Gère le catalogue de la boutique."
      icon="📦"
      accent="indigo"
      endpoint="/products"
      resourceName="produit"
      fields={[
        { name: "name", label: "Nom", placeholder: "T-shirt oversize" },
        { name: "price", label: "Prix (FCFA)", type: "number", placeholder: "5000" },
        { name: "stock", label: "Stock", type: "number", placeholder: "10" },
        { name: "category", label: "Catégorie", options: CATEGORY_OPTIONS, required: false },
        { name: "imageUrl", label: "Image (URL)", placeholder: "https://…", required: false },
        { name: "description", label: "Description", required: false },
      ]}
      columns={[
        { key: "id", header: "ID", className: "text-slate-400" },
        {
          key: "name",
          header: "Nom",
          render: (p) => <span className="font-medium text-slate-900">{p.name}</span>,
        },
        {
          key: "category",
          header: "Catégorie",
          render: (p) =>
            p.category ? (
              categoryLabel(p.category)
            ) : (
              <span className="text-slate-400">—</span>
            ),
        },
        {
          key: "price",
          header: "Prix",
          render: (p) => (
            <span className="font-medium text-emerald-600">{formatFcfa(p.price)}</span>
          ),
        },
        {
          key: "stock",
          header: "Stock",
          render: (p) => (
            <Badge tone={p.stock > 0 ? "green" : "red"}>{p.stock}</Badge>
          ),
        },
      ]}
    />
  );
}
