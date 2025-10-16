export function validateBoolean(value: unknown): string | undefined {
  if (typeof value !== 'boolean') {
    return 'Invalid boolean';
  }
}
