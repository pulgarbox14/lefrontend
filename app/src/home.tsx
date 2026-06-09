import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/lib/auth";

export function meta() {
  return [
    { title: "MyShop — Gérez votre boutique simplement" },
    {
      name: "description",
      content:
        "MyShop : gérez vos produits, commandes, stock et paiements depuis une seule interface.",
    },
  ];
}

const FEATURES = [
  { icon: "📦", title: "Produits", text: "Gère ton catalogue, tes prix et ton stock." },
  { icon: "🛍️", title: "Commandes", text: "Suis les commandes de tes clients en temps réel." },
  { icon: "🏭", title: "Stock", text: "Garde un œil sur les quantités disponibles." },
  { icon: "💳", title: "Paiements", text: "Enregistre et consulte tous les paiements." },
];

export default function HomeRoute() {
  const { isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && isAuthenticated) navigate("/dashboard", { replace: true });
  }, [ready, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barre de navigation */}
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 text-xl font-bold text-slate-900">
            🛒 MyShop
          </span>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Créer un compte
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
          Gestion de boutique
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Gère ta boutique, simplement.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
          Produits, commandes, stock et paiements réunis dans une seule
          interface claire et rapide.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition hover:bg-indigo-700"
          >
            Commencer gratuitement
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50"
          >
            J'ai déjà un compte
          </Link>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} MyShop
      </footer>
    </div>
  );
}
