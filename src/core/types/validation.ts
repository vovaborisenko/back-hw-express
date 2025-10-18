export interface ValidationError<T extends object> {
  field: keyof T;
  message: string;
}

export interface ErrorMessages<T extends object> {
  errorsMessages: ValidationError<T>[];
}

export type ValidateFn = (value: unknown) => string | undefined;

export type ValidationEntries<T extends object> = [keyof T, ValidateFn][];
