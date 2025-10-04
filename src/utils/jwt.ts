import { sign, verify } from 'hono/jwt';
import type { JWTPayload } from 'hono/utils/jwt/types';
import { config } from '@/config';
import type { UserRole } from '@/database';
import type { AppContext } from './hono';

export interface UserJwtPayload {
  sub: string;
  role: UserRole;
}

export const signJWT = async ({ sub, role }: UserJwtPayload, expiresIn: number, secret: string) =>
  await sign(
    {
      sub,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    },
    secret
  );

export const signJWTs = async (payload: UserJwtPayload) => ({
  accessToken: await signJWT(payload, config.jwt.accessExpiresIn, config.jwt.accessSecret),
  refreshToken: await signJWT(payload, config.jwt.refreshExpiresIn, config.jwt.refreshSecret),
});

export const verifyJWT = async (
  token: string,
  secret: string
): Promise<JWTPayload & UserJwtPayload> =>
  (await verify(token, secret)) as JWTPayload & UserJwtPayload;

export const getUserId = (c: AppContext) => Number(c.get('jwtPayload').sub);
export const getUserRole = (c: AppContext) => c.get('jwtPayload').role;
