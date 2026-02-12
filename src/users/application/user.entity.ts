import { randomUUID } from 'node:crypto';
import { User } from '../types/user';

export class UserEntity implements User {
  public createdAt: Date;
  public emailConfirmation: {
    expirationDate: Date;
    confirmationCode: string;
    isConfirmed: boolean;
  };
  public recovery = null;

  constructor(
    public login: string,
    public email: string,
    public passwordHash: string,
    isConfirmed = false,
  ) {
    this.createdAt = new Date();
    this.emailConfirmation =
      UserEntity.generateEmailConfirmationData(isConfirmed);
  }

  static generateEmailConfirmationData(
    isConfirmed: boolean = false,
  ): User['emailConfirmation'] {
    return {
      expirationDate: new Date(Date.now() + 3.6e6),
      confirmationCode: randomUUID(),
      isConfirmed,
    };
  }
}
