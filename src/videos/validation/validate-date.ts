const pattern =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?$/;
export function validateDate(value: unknown): string | undefined {
  if (
    typeof value !== 'string' ||
    !pattern.test(value) ||
    isNaN(Date.parse(value))
  ) {
    return 'Invalid date';
  }
}
