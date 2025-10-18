export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorMessages {
  errorsMessages: ValidationError[];
}
