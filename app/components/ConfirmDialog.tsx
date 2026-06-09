// Boîte de dialogue de confirmation (ex. avant une suppression).
import { useState } from "react";
import { apiErrorMessage } from "~/lib/api";
import { Alert, Button, Modal } from "./ui";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmer",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(apiErrorMessage(err, "L'opération a échoué."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} title={title} onClose={loading ? () => {} : onCancel}>
      <p className="text-sm text-slate-600">{message}</p>
      {error && (
        <div className="mt-3">
          <Alert tone="error">{error}</Alert>
        </div>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
