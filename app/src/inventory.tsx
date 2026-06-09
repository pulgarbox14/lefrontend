import { CrudPage } from "~/components/CrudPage";
import { Badge } from "~/components/ui";
import { formatFcfa } from "~/lib/format";
import type { InventoryItem } from "~/lib/types";

export function meta() {
  return [{ title: "MyShop — Stock" }];
}

export default function InventoryRoute() {
  return (
    <CrudPage<InventoryItem>
      title="Stock"
      subtitle="Surveille les quantités disponibles en entrepôt."
      icon="🏭"
      accent="amber"
      endpoint="/inventory"
      resourceName="article"
      fields={[
        { name: "productName", label: "Nom du produit", placeholder: "T-shirt" },
        { name: "quantity", label: "Quantité", type: "number", placeholder: "50" },
        { name: "price", label: "Prix (FCFA)", type: "number", placeholder: "5000" },
      ]}
      columns={[
        { key: "id", header: "ID", className: "text-slate-400" },
        {
          key: "productName",
          header: "Produit",
          render: (i) => (
            <span className="font-medium text-slate-900">{i.productName}</span>
          ),
        },
        {
          key: "quantity",
          header: "Quantité",
          render: (i) => (
            <Badge tone={i.quantity > 0 ? "green" : "red"}>{i.quantity}</Badge>
          ),
        },
        {
          key: "price",
          header: "Prix",
          render: (i) => (
            <span className="font-medium text-amber-600">{formatFcfa(i.price)}</span>
          ),
        },
      ]}
    />
  );
}
