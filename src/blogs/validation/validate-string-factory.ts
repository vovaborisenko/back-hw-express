export function validateStringFactory(maxLenght: number) {
  return (value: unknown): string | undefined => {
    if (typeof value !== 'string') {
      return 'Invalid string';
    }

    const cleanValue = value.trim();

    if (cleanValue.length === 0) {
      return 'Required value';
    }

    if (cleanValue.length > maxLenght) {
      return `Max length ${maxLenght}`;
    }
  };
}
