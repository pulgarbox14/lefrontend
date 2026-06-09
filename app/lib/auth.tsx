// Contexte d'authentification : login / register / logout + rôle (admin / user).
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "./api";
import { decodeJwt } from "./jwt";
import {
  clearSession,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from "./session";
import type { AuthResponse, Role, User } from "./types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** Passe à true une fois la session restaurée depuis le navigateur. */
  ready: boolean;
  login: (email: string, password: string) => Promise<User>;
  /** Renvoie true si l'inscription a aussi connecté l'utilisateur (token reçu). */
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function extractToken(data: AuthResponse | undefined): string | null {
  if (!data) return null;
  return data.access_token ?? data.accessToken ?? data.token ?? data.jwt ?? null;
}

function normalizeRole(value: unknown): Role | undefined {
  if (value === "admin") return "admin";
  if (value === "user") return "user";
  return undefined;
}

// Construit l'utilisateur à partir de la réponse, en allant chercher le rôle
// dans l'objet user OU dans le payload du token.
function resolveUser(
  data: AuthResponse | undefined,
  email: string,
  token: string | null,
): User {
  const base: User = data?.user ?? { email };
  let role = normalizeRole(base.role);

  if (!role && token) {
    const payload = decodeJwt(token);
    const fromRole = normalizeRole(payload?.role);
    const fromRoles = Array.isArray(payload?.roles)
      ? normalizeRole((payload?.roles as unknown[])[0])
      : undefined;
    role = fromRole ?? fromRoles;
  }

  return { ...base, email: base.email ?? email, role: role ?? "user" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Restauration de la session au montage (côté navigateur uniquement).
  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setTokenState(stored);
      setUser(getStoredUser());
    }
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    const newToken = extractToken(data);
    if (newToken) {
      setToken(newToken);
      setTokenState(newToken);
    }
    const nextUser = resolveUser(data, email, newToken);
    setStoredUser(nextUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/register", {
      email,
      password,
    });
    const newToken = extractToken(data);
    if (newToken) {
      setToken(newToken);
      setTokenState(newToken);
      const nextUser = resolveUser(data, email, newToken);
      setStoredUser(nextUser);
      setUser(nextUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setTokenState(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "admin",
      ready,
      login,
      register,
      logout,
    }),
    [user, token, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>.");
  }
  return ctx;
}
