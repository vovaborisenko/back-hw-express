import { ValidationEntries, ValidationError } from '../types/validation';

export function validateDto<T extends object, V extends ValidationEntries<T>>(
  data: T,
  validationEntries: V,
): ValidationError<T>[] {
  return validationEntries.flatMap(([field, validate]) => {
    const message = validate(data[field]);

    return message ? { field, message } : [];
  });
}
