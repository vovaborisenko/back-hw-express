import { ErrorMessages, ValidationError } from '../types/validation';

export function createErrorMessages(errors: ValidationError[]): ErrorMessages {
  return { errorsMessages: errors };
}
