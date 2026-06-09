import { CrudPage } from "~/components/CrudPage";
import { Badge } from "~/components/ui";
import { formatFcfa } from "~/lib/format";
import type { Product } from "~/lib/types";

export function meta() {
  return [{ title: "MyShop — Produits" }];
}

export default function ProductsRoute() {
  return (
    <CrudPage<Product>
      title="Produits"
      subtitle="Gère le catalogue de ta boutique."
      icon="📦"
      accent="indigo"
      endpoint="/products"
      resourceName="produit"
      fields={[
        { name: "name", label: "Nom", placeholder: "T-shirt" },
        { name: "price", label: "Prix (FCFA)", type: "number", placeholder: "5000" },
        { name: "stock", label: "Stock", type: "number", placeholder: "10" },
      ]}
      columns={[
        { key: "id", header: "ID", className: "text-slate-400" },
        {
          key: "name",
          header: "Nom",
          render: (p) => <span className="font-medium text-slate-900">{p.name}</span>,
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
