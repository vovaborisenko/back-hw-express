export function validateAuthor(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return 'Invalid string';
  }

  const cleanValue = value.trim();

  if (cleanValue.length === 0) {
    return 'Required value';
  }

  if (cleanValue.length > 20) {
    return 'Max length 20';
  }
}
