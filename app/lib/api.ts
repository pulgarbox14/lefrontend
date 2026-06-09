// Client HTTP centralisé. Toutes les requêtes passent par ici.
import axios from "axios";
import { clearSession, getToken } from "./session";

// URL du backend, configurable via .env (VITE_API_URL), sinon localhost:3000.
export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Ajoute automatiquement le token d'auth sur chaque requête.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si le backend répond 401, la session est invalide -> on déconnecte.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      clearSession();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

// Transforme une erreur axios en message lisible pour l'utilisateur.
export function apiErrorMessage(
  error: unknown,
  fallback = "Une erreur est survenue.",
): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Impossible de joindre le serveur. Vérifie que le backend est démarré (" + API_URL + ").";
    }
    const data = error.response.data as
      | { message?: string | string[]; error?: string }
      | undefined;
    if (data) {
      if (Array.isArray(data.message)) return data.message.join(", ");
      if (typeof data.message === "string") return data.message;
      if (typeof data.error === "string") return data.error;
    }
  }
  return fallback;
}
