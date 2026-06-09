import { CrudPage } from "~/components/CrudPage";
import { Badge } from "~/components/ui";
import { formatFcfa } from "~/lib/format";
import type { Order } from "~/lib/types";

export function meta() {
  return [{ title: "MyShop — Commandes" }];
}

export default function OrdersRoute() {
  return (
    <CrudPage<Order>
      title="Commandes"
      subtitle="Suis les commandes de tes clients."
      icon="🛍️"
      accent="emerald"
      endpoint="/orders"
      resourceName="commande"
      fields={[
        { name: "customerName", label: "Nom du client", placeholder: "Awa Diop" },
        { name: "quantity", label: "Quantité", type: "number", placeholder: "2" },
        { name: "totalPrice", label: "Prix total (FCFA)", type: "number", placeholder: "10000" },
      ]}
      columns={[
        { key: "id", header: "ID", className: "text-slate-400" },
        {
          key: "customerName",
          header: "Client",
          render: (o) => (
            <span className="font-medium text-slate-900">{o.customerName}</span>
          ),
        },
        { key: "quantity", header: "Quantité" },
        {
          key: "totalPrice",
          header: "Prix total",
          render: (o) => (
            <span className="font-medium text-emerald-600">{formatFcfa(o.totalPrice)}</span>
          ),
        },
        {
          key: "status",
          header: "Statut",
          render: (o) =>
            o.status ? <Badge tone="yellow">{o.status}</Badge> : <span className="text-slate-400">—</span>,
        },
      ]}
    />
  );
}
