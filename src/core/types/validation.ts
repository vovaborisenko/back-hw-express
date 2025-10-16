export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorMessages {
  errorsMessages: ValidationError[];
}

export type ValidateFn = (value: unknown) => string | undefined;

export type ValidationEntries = [string, ValidateFn][];
