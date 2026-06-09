// Tableau de données générique : gère les états chargement / erreur / vide,
// le rendu des colonnes et une colonne d'actions optionnelle.
import type { ReactNode } from "react";
import { Alert, Button, EmptyState, Spinner } from "./ui";

export interface Column<T> {
  /** Clé d'identité de la colonne (et accès par défaut à la valeur). */
  key: keyof T | string;
  header: string;
  /** Rendu personnalisé de la cellule. */
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  rowActions?: (row: T) => ReactNode;
}

export function DataTable<T extends { id: number | string }>({
  columns,
  rows,
  loading,
  error,
  onRetry,
  emptyTitle = "Aucune donnée",
  emptyDescription,
  rowActions,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 px-6 py-16 text-slate-500">
        <Spinner className="h-5 w-5" />
        <span>Chargement…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3 p-6">
        <Alert tone="error">{error}</Alert>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Réessayer
          </Button>
        )}
      </div>
    );
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-3">
                {col.header}
              </th>
            ))}
            {rowActions && <th className="px-6 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={String(row.id)} className="transition hover:bg-slate-50">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-6 py-4 text-slate-700 ${col.className ?? ""}`}
                >
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key as string] ?? "—")}
                </td>
              ))}
              {rowActions && (
                <td className="px-6 py-4 text-right">{rowActions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
