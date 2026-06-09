// Espace d'administration : barre latérale + garde d'auth + garde de rôle admin.
// Utilisé comme route "layout" -> rend <Outlet /> pour les pages /admin/*.
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "~/lib/auth";
import { Button, Spinner, cn } from "./ui";

const NAV_ITEMS = [
  { to: "/admin", label: "Tableau de bord", icon: "📊", end: true },
  { to: "/admin/products", label: "Produits", icon: "📦" },
  { to: "/admin/orders", label: "Commandes", icon: "🛍️" },
  { to: "/admin/inventory", label: "Stock", icon: "🏭" },
  { to: "/admin/payments", label: "Paiements", icon: "💳" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <span className="text-2xl">🛍️</span>
        <span className="text-lg font-bold text-slate-900">MyShop Admin</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          ← Voir la boutique
        </Link>
      </div>
    </div>
  );
}

export default function AppLayout() {
  const { isAuthenticated, isAdmin, ready, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Gardes : non connecté -> /login ; connecté mais non admin -> boutique.
  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [ready, isAuthenticated, isAdmin, navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-400">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-slate-200 bg-white">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>
          <div className="ml-auto flex items-center gap-3">
            {user?.email && (
              <span className="hidden text-sm text-slate-600 sm:inline">
                {user.email}
              </span>
            )}
            <Button variant="secondary" size="sm" onClick={logout}>
              Déconnexion
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
