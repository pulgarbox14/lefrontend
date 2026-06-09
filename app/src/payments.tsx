import { CrudPage } from "~/components/CrudPage";
import { Badge } from "~/components/ui";
import { formatFcfa } from "~/lib/format";
import type { Payment } from "~/lib/types";

export function meta() {
  return [{ title: "MyShop — Paiements" }];
}

export default function PaymentsRoute() {
  return (
    <CrudPage<Payment>
      title="Paiements"
      subtitle="Enregistre et consulte les paiements reçus."
      icon="💳"
      accent="violet"
      endpoint="/payments"
      resourceName="paiement"
      fields={[
        { name: "amount", label: "Montant (FCFA)", type: "number", placeholder: "10000" },
        {
          name: "paymentMethod",
          label: "Méthode",
          options: [
            { value: "cash", label: "Espèces" },
            { value: "card", label: "Carte" },
            { value: "mobile", label: "Mobile money" },
          ],
        },
      ]}
      columns={[
        { key: "id", header: "ID", className: "text-slate-400" },
        {
          key: "amount",
          header: "Montant",
          render: (p) => (
            <span className="font-medium text-violet-600">{formatFcfa(p.amount)}</span>
          ),
        },
        { key: "paymentMethod", header: "Méthode" },
        {
          key: "status",
          header: "Statut",
          render: (p) =>
            p.status ? <Badge tone="green">{p.status}</Badge> : <span className="text-slate-400">—</span>,
        },
      ]}
    />
  );
}
