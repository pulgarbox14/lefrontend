// Page CRUD générique, pilotée par configuration.
// Une page ressource = un titre + des champs de formulaire + des colonnes.
import { useState, type FormEvent } from "react";
import { apiErrorMessage } from "~/lib/api";
import { useCrud } from "~/hooks/useCrud";
import { ConfirmDialog } from "./ConfirmDialog";
import { type Column, DataTable } from "./DataTable";
import {
  Alert,
  Button,
  Card,
  Field,
  PageHeader,
  Select,
  TextInput,
} from "./ui";

export interface CrudField {
  name: string;
  label: string;
  type?: "text" | "number";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

type Accent = "indigo" | "emerald" | "amber" | "violet";

const ACCENTS: Record<Accent, string> = {
  indigo: "bg-indigo-100 text-indigo-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
};

interface CrudPageProps<T> {
  title: string;
  subtitle?: string;
  icon: string;
  accent?: Accent;
  endpoint: string;
  /** Nom singulier de la ressource (libellés "Ajouter un …"). */
  resourceName: string;
  fields: CrudField[];
  columns: Column<T>[];
}

function emptyForm(fields: CrudField[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.name, ""]));
}

export function CrudPage<T extends { id: number | string }>({
  title,
  subtitle,
  icon,
  accent = "indigo",
  endpoint,
  resourceName,
  fields,
  columns,
}: CrudPageProps<T>) {
  const { items, loading, error, reload, create, remove } = useCrud<T>(endpoint);

  const [form, setForm] = useState<Record<string, string>>(emptyForm(fields));
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);

  const setValue = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    // Validation des champs obligatoires.
    const missing = fields.find(
      (f) => f.required !== false && form[f.name].trim() === "",
    );
    if (missing) {
      setFormError(`Le champ « ${missing.label} » est obligatoire.`);
      return;
    }

    // Construction du payload (conversion des nombres ; on n'envoie pas les
    // champs optionnels laissés vides).
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = form[f.name].trim();
      if (raw === "" && f.required === false) continue;
      payload[f.name] = f.type === "number" ? Number(raw) : raw;
    }

    setSubmitting(true);
    try {
      await create(payload);
      setForm(emptyForm(fields));
    } catch (err) {
      setFormError(apiErrorMessage(err, "La création a échoué."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        icon={icon}
        iconClassName={ACCENTS[accent]}
        title={title}
        subtitle={subtitle}
      />

      {/* Formulaire de création */}
      <Card className="mb-6 p-6">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          {fields.map((field) => (
            <div key={field.name} className="min-w-[12rem] flex-1">
              <Field
                label={field.label}
                htmlFor={`field-${field.name}`}
                required={field.required !== false}
              >
                {field.options ? (
                  <Select
                    id={`field-${field.name}`}
                    value={form[field.name]}
                    onChange={(e) => setValue(field.name, e.target.value)}
                  >
                    <option value="">—</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <TextInput
                    id={`field-${field.name}`}
                    type={field.type === "number" ? "number" : "text"}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={(e) => setValue(field.name, e.target.value)}
                  />
                )}
              </Field>
            </div>
          ))}
          <Button type="submit" loading={submitting}>
            Ajouter
          </Button>
        </form>
        {formError && (
          <div className="mt-4">
            <Alert tone="error">{formError}</Alert>
          </div>
        )}
      </Card>

      {/* Liste */}
      <Card className="overflow-hidden">
        <DataTable<T>
          columns={columns}
          rows={items}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle={`Aucun élément pour le moment`}
          emptyDescription={`Ajoute un premier ${resourceName} avec le formulaire ci-dessus.`}
          rowActions={(row) => (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setPendingDelete(row)}
            >
              Supprimer
            </Button>
          )}
        />
      </Card>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Supprimer ce ${resourceName} ?`}
        message="Cette action est définitive et ne peut pas être annulée."
        confirmLabel="Supprimer"
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (pendingDelete) {
            await remove(pendingDelete.id);
            setPendingDelete(null);
          }
        }}
      />
    </>
  );
}
