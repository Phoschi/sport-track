// French display: comma decimal separator, at most 2 decimals, no trailing zeros.
const frenchNumberFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 2,
  useGrouping: false,
});

export function formatDecimal(value: number): string {
  return frenchNumberFormatter.format(value);
}

/** Parses user input accepting both "17,5" and "17.5". Returns null if invalid. */
export function parseDecimal(input: string): number | null {
  const normalized = input.trim().replace(',', '.');
  if (normalized === '' || !/^-?\d*\.?\d+$/.test(normalized)) return null;
  return Number(normalized);
}
