import type { Context, Next } from 'hono';
import type { UserRole } from '@/database/tables';
import { ApiError } from '@/exceptions';
import { getUserRole } from '@/utils';

export const roleMiddleware = (role: UserRole) => async (c: Context, next: Next) => {
  if (getUserRole(c) !== role) return c.json(ApiError.Forbidden().toJSON(), 403);

  await next();
};
