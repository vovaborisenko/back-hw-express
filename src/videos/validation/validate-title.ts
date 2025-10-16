export function validateTitle(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return 'Invalid string';
  }

  const cleanTitle = value.trim();

  if (cleanTitle.length === 0) {
    return 'Required value';
  }

  if (cleanTitle.length > 40) {
    return 'Max length 40';
  }
}
