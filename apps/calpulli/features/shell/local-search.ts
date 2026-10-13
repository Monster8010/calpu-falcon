export function normalizeLocalSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX")
    .trim();
}

export function matchesLocalSearch(
  query: string,
  values: readonly (string | undefined)[],
): boolean {
  const normalizedQuery = normalizeLocalSearch(query);

  if (normalizedQuery.length === 0) {
    return true;
  }

  return values.some((value) =>
    value === undefined
      ? false
      : normalizeLocalSearch(value).includes(normalizedQuery),
  );
}
