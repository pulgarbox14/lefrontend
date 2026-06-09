import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { AuthShell } from "~/components/AuthShell";
import { Alert, Button, Field, TextInput } from "~/components/ui";
import { apiErrorMessage } from "~/lib/api";
import { useAuth } from "~/lib/auth";

export function meta() {
  return [{ title: "MyShop — Inscription" }];
}

export default function RegisterRoute() {
  const { register, isAuthenticated, isAdmin, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && isAuthenticated) navigate(isAdmin ? "/admin" : "/", { replace: true });
  }, [ready, isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const loggedIn = await register(email, password);
      // Si le backend renvoie un token on est connecté, sinon on passe par la connexion.
      navigate(loggedIn ? "/" : "/login");
    } catch (err) {
      setError(apiErrorMessage(err, "Impossible de créer le compte."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Créer un compte"
      subtitle="Quelques secondes suffisent."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Se connecter
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
            autoComplete="new-password"
            placeholder="Au moins 6 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Field label="Confirmer le mot de passe" htmlFor="confirm" required>
          <TextInput
            id="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </Field>
        <Button type="submit" className="w-full" loading={loading}>
          S'inscrire
        </Button>
      </form>
    </AuthShell>
  );
}
