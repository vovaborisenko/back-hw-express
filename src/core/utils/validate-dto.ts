import { ValidationEntries, ValidationError } from '../types/validation';

export function validateDto<
  T extends Record<string, unknown>,
  V extends ValidationEntries,
>(data: T, validationEntries: V): ValidationError[] {
  return validationEntries.flatMap(([field, validate]) => {
    const message = validate(data[field]);

    return message ? { field, message } : [];
  });
}
