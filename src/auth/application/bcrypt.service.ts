import bcrypt from 'bcrypt';
import { injectable } from 'inversify';

@injectable()
export class BcryptService {
  createHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
