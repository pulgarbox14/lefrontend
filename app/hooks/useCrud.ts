// Hook générique pour gérer une ressource REST (liste / création / suppression)
// avec états de chargement et d'erreur. Réutilisé par toutes les pages CRUD.
import { useCallback, useEffect, useState } from "react";
import { api, apiErrorMessage } from "~/lib/api";

export interface CrudState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  create: (payload: Record<string, unknown>) => Promise<void>;
  remove: (id: number | string) => Promise<void>;
}

export function useCrud<T extends { id: number | string }>(
  endpoint: string,
): CrudState<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<T[]>(endpoint);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(apiErrorMessage(err, "Impossible de charger les données."));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (payload: Record<string, unknown>) => {
      await api.post<T>(endpoint, payload);
      await reload();
    },
    [endpoint, reload],
  );

  const remove = useCallback(
    async (id: number | string) => {
      await api.delete(`${endpoint}/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [endpoint],
  );

  return { items, loading, error, reload, create, remove };
}
