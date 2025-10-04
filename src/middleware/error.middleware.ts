import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { JwtTokenExpired, JwtTokenInvalid } from 'hono/utils/jwt/types';
import { ApiError } from '@/exceptions';
import { log } from '@/utils';

export const errorMiddleware = (error: unknown, c: Context) => {
  if (
    error instanceof JwtTokenExpired
    || error instanceof JwtTokenInvalid
    || (error instanceof HTTPException && error.status === 401)
  )
    return c.json(ApiError.Unauthorized().toJSON(), 401);

  if (error instanceof ApiError) return c.json(error.toJSON(), error.status);

  log.error(error);

  return c.json(ApiError.InternalServerError().toJSON(), 500);
};
