import jws from 'jsonwebtoken';
import { SETTINGS } from '../../core/settings/settings';
import { TokenPayload } from '../types/auth';

export const jwtService = {
  createToken(userId: string): string {
    return jws.sign({ userId }, SETTINGS.AC_SECRET, {
      expiresIn: '1h',
    });
  },
  verifyToken(token: string): TokenPayload | null {
    try {
      return jws.verify(token, SETTINGS.AC_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  },
};
