import { useEffect, useState } from "react";
import { Link } from "react-router";
import { DataTable } from "~/components/DataTable";
import {
  Alert,
  Badge,
  Card,
  PageHeader,
  Spinner,
  cn,
} from "~/components/ui";
import { api, apiErrorMessage } from "~/lib/api";
import { formatFcfa } from "~/lib/format";
import type { InventoryItem, Order, Payment, Product } from "~/lib/types";

export function meta() {
  return [{ title: "MyShop — Tableau de bord" }];
}

interface DashboardData {
  products: Product[];
  orders: Order[];
  inventory: InventoryItem[];
  payments: Payment[];
}

const asArray = <V,>(value: unknown): V[] => (Array.isArray(value) ? (value as V[]) : []);

export default function DashboardRoute() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      const results = await Promise.allSettled([
        api.get<Product[]>("/products"),
        api.get<Order[]>("/orders"),
        api.get<InventoryItem[]>("/inventory"),
        api.get<Payment[]>("/payments"),
      ]);
      if (!active) return;

      // Si tout échoue, c'est probablement le backend qui est injoignable.
      if (results.every((r) => r.status === "rejected")) {
        const firstRejected = results.find((r) => r.status === "rejected");
        setError(
          apiErrorMessage(
            firstRejected && "reason" in firstRejected ? firstRejected.reason : undefined,
            "Impossible de charger le tableau de bord.",
          ),
        );
        setLoading(false);
        return;
      }

      const value = (i: number) =>
        results[i].status === "fulfilled"
          ? (results[i] as PromiseFulfilledResult<{ data: unknown }>).value.data
          : [];

      setData({
        products: asArray<Product>(value(0)),
        orders: asArray<Order>(value(1)),
        inventory: asArray<InventoryItem>(value(2)),
        payments: asArray<Payment>(value(3)),
      });
      setLoading(false);
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-400">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader icon="📊" title="Tableau de bord" />
        <Alert tone="error">{error}</Alert>
      </>
    );
  }

  if (!data) return null;

  const revenue = data.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const stockTotal = data.inventory.reduce(
    (sum, i) => sum + (Number(i.quantity) || 0),
    0,
  );

  const stats: {
    label: string;
    value: string;
    icon: string;
    accent: string;
    to: string;
  }[] = [
    { label: "Produits", value: String(data.products.length), icon: "📦", accent: "bg-indigo-100 text-indigo-700", to: "/products" },
    { label: "Commandes", value: String(data.orders.length), icon: "🛍️", accent: "bg-emerald-100 text-emerald-700", to: "/orders" },
    { label: "Articles en stock", value: String(stockTotal), icon: "🏭", accent: "bg-amber-100 text-amber-700", to: "/inventory" },
    { label: "Encaissé", value: formatFcfa(revenue), icon: "💳", accent: "bg-violet-100 text-violet-700", to: "/payments" },
  ];

  const recentOrders = [...data.orders].slice(-5).reverse();

  return (
    <>
      <PageHeader
        icon="📊"
        title="Tableau de bord"
        subtitle="Vue d'ensemble de ton activité."
      />

      {/* Cartes de statistiques */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="p-5 transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  {s.label}
                </span>
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-lg",
                    s.accent,
                  )}
                >
                  {s.icon}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{s.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Commandes récentes */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Commandes récentes</h2>
          <Link
            to="/orders"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Tout voir
          </Link>
        </div>
        <DataTable<Order>
          rows={recentOrders}
          emptyTitle="Aucune commande pour le moment"
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
              header: "Total",
              render: (o) => (
                <span className="font-medium text-emerald-600">
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
                  <span className="text-slate-400">—</span>
                ),
            },
          ]}
        />
      </Card>
    </>
  );
}
