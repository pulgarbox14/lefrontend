// Helpers de formatage.

const numberFormat = new Intl.NumberFormat("fr-FR");

/** Formate un montant en FCFA, ex. 12000 -> "12 000 FCFA". */
export function formatFcfa(value: number | string): string {
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) return String(value);
  return `${numberFormat.format(n)} FCFA`;
}
