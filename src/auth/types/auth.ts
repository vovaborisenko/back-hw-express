import { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export interface ReqUser {
  id: string;
}
