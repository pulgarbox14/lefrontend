// Mise en page partagée des écrans connexion / inscription.
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Card } from "./ui";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900"
          >
            <span>🛒</span> MyShop
          </Link>
        </div>
        <Card className="p-8">
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </Card>
        {footer && (
          <p className="mt-4 text-center text-sm text-slate-500">{footer}</p>
        )}
      </div>
    </div>
  );
}
