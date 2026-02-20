export interface Recovery {
  expirationDate: Date;
  code: string;
}

export interface EmailConfirmation {
  expirationDate: Date;
  confirmationCode: string;
  isConfirmed: boolean;
}

export interface User {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: EmailConfirmation;
  recovery: Recovery | null;
}
