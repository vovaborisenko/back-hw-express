export function validateAge(value: unknown): string | undefined {
  if (value === null) return;

  if (typeof value !== 'number') {
    return 'Invalid number';
  }

  if (value < 1) {
    return 'Min 1';
  }

  if (value > 18) {
    return 'Max 18';
  }
}
