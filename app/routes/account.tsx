import { useEffect } from "react";
import { useNavigate } from "react-router";
import { DataTable } from "~/components/DataTable";
import { Badge, Button, Card, PageHeader } from "~/components/ui";
import { useCrud } from "~/hooks/useCrud";
import { useAuth } from "~/lib/auth";
import { formatFcfa } from "~/lib/format";
import type { Order } from "~/lib/types";

export function meta() {
  return [{ title: "MyShop — Mon compte" }];
}

export default function AccountRoute() {
  const { isAuthenticated, ready, user, logout } = useAuth();
  const navigate = useNavigate();
  const { items, loading, error, reload } = useCrud<Order>("/orders");

  useEffect(() => {
    if (ready && !isAuthenticated) navigate("/login", { replace: true });
  }, [ready, isAuthenticated, navigate]);

  if (!ready || !isAuthenticated) return null;

  const identity = (user?.name || user?.email || "").toLowerCase();
  const myOrders = items.filter(
    (o) => (o.customerName ?? "").toLowerCase() === identity,
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        icon="👤"
        title="Mon compte"
        subtitle={user?.email}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Déconnexion
          </Button>
        }
      />

      <h2 className="mb-4 text-lg font-semibold text-slate-900">Mes commandes</h2>
      <Card className="overflow-hidden">
        <DataTable<Order>
          rows={myOrders}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle="Aucune commande"
          emptyDescription="Tes commandes apparaîtront ici après ton premier achat."
          columns={[
            { key: "id", header: "N°", className: "text-slate-400" },
            { key: "quantity", header: "Articles" },
            {
              key: "totalPrice",
              header: "Total",
              render: (o) => (
                <span className="font-medium text-slate-900">
                  {formatFcfa(o.totalPrice)}
                </span>
              ),
            },
            {
              key: "status",
              header: "Statut",
              render: (o) =>
                o.status ? (
                  <Badge tone="yellow">{o.status}</Badge>
                ) : (
                  <Badge tone="green">Confirmée</Badge>
                ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
