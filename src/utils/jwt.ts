import { sign, verify } from 'hono/jwt';
import type { JWTPayload } from 'hono/utils/jwt/types';
import { config } from '@/config';
import type { UserRole } from '@/database/tables';
import { ApiError } from '@/exceptions/api-error';
import type { AppContext } from './hono';
import { log } from './logger';

export interface UserJwtPayload {
  sub: string;
  role: UserRole;
}

export const signJWT = async ({ sub, role }: UserJwtPayload, expiresIn: number, secret: string) => {
  try {
    const token = await sign(
      {
        sub,
        role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
      },
      secret
    );
    return token;
  } catch (error) {
    log.error(error);
    throw ApiError.Unauthorized();
  }
};

export const signJWTs = async (payload: UserJwtPayload) => ({
  accessToken: await signJWT(payload, config.jwt.accessExpiresIn, config.jwt.accessSecret),
  refreshToken: await signJWT(payload, config.jwt.refreshExpiresIn, config.jwt.refreshSecret),
});

export const verifyJWT = async (
  token: string,
  secret: string
): Promise<JWTPayload & UserJwtPayload> => {
  try {
    const payload = await verify(token, secret);
    return payload as JWTPayload & UserJwtPayload;
  } catch (error) {
    log.error(error);
    throw ApiError.Unauthorized();
  }
};

export const getUserId = (c: AppContext) => Number(c.get('jwtPayload').sub);
export const getUserRole = (c: AppContext) => c.get('jwtPayload').role;
