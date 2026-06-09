import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { AuthShell } from "~/components/AuthShell";
import { Alert, Button, Field, TextInput } from "~/components/ui";
import { apiErrorMessage } from "~/lib/api";
import { useAuth } from "~/lib/auth";

export function meta() {
  return [{ title: "MyShop — Connexion" }];
}

export default function LoginRoute() {
  const { login, isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Déjà connecté -> direction le tableau de bord.
  useEffect(() => {
    if (ready && isAuthenticated) navigate("/dashboard", { replace: true });
  }, [ready, isAuthenticated, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err, "Email ou mot de passe incorrect."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Connexion"
      subtitle="Accède à ton espace de gestion."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert tone="error">{error}</Alert>}
        <Field label="Email" htmlFor="email" required>
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            placeholder="toi@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Mot de passe" htmlFor="password" required>
          <TextInput
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Button type="submit" className="w-full" loading={loading}>
          Se connecter
        </Button>
      </form>
    </AuthShell>
  );
}
