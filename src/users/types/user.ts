export interface Recovery {
  expirationDate: Date;
  code: string;
}

export interface User {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: {
    expirationDate: Date;
    confirmationCode: string;
    isConfirmed: boolean;
  };
  recovery: Recovery | null;
}
