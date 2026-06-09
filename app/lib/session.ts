// Stockage de session côté navigateur (token + utilisateur).
// Aucune dépendance à React ou axios -> pas de cycle d'import.
import type { User } from "./types";

const TOKEN_KEY = "myshop.token";
const USER_KEY = "myshop.user";

const hasWindow = () => typeof window !== "undefined";

export function getToken(): string | null {
  if (!hasWindow()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (!hasWindow()) return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function getStoredUser(): User | null {
  if (!hasWindow()) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  if (!hasWindow()) return;
  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_KEY);
  }
}

export function clearSession(): void {
  if (!hasWindow()) return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
