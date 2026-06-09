// Coquille de la boutique côté client : en-tête + panier + pied de page.
import { Link, NavLink, Outlet } from "react-router";
import { useAuth } from "~/lib/auth";
import { useCart } from "~/lib/cart";
import { CATEGORIES } from "~/lib/categories";
import { cn } from "./ui";

export default function StorefrontLayout() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { count } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-bold text-slate-900">
            🛍️ MyShop
          </Link>

          <div className="hidden items-center gap-5 md:flex">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition hover:text-indigo-600",
                  isActive ? "text-indigo-600" : "text-slate-600",
                )
              }
            >
              Boutique
            </NavLink>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="text-sm text-slate-600 transition hover:text-indigo-600"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden text-sm text-slate-500 transition hover:text-slate-900 sm:inline"
              >
                Admin
              </Link>
            )}
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="text-sm font-medium text-slate-700 transition hover:text-indigo-600"
            >
              {isAuthenticated ? "Mon compte" : "Connexion"}
            </Link>
            <Link
              to="/cart"
              className="relative rounded-lg p-2 text-xl transition hover:bg-slate-100"
              aria-label="Panier"
            >
              🛒
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <span className="font-semibold text-slate-700">🛍️ MyShop</span>
          <span>Vêtements · Chaussures · Accessoires · Mode</span>
          <span>© {new Date().getFullYear()} MyShop</span>
        </div>
      </footer>
    </div>
  );
}
