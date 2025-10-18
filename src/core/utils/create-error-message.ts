import { ErrorMessages, ValidationError } from '../types/validation';

export function createErrorMessages<T extends object>(
  errors: ValidationError<T>[],
): ErrorMessages<T> {
  return { errorsMessages: errors };
}
