export enum Cookies {
  RefreshToken = 'refreshToken',
}

export const RefreshTokenCookiesOptions = {
  httpOnly: true,
  secure: true,
} as const;
