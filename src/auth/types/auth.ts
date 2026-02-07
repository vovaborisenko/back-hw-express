import { JwtPayload } from 'jsonwebtoken';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export type RefreshTokenPayload = JwtPayload & RefreshTokenDto;

export interface ReqUser {
  id: string;
}
export interface ReqDevice {
  id: string;
  issuedAt: Date;
}
