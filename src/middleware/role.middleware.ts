import type { Context, Next } from 'hono';
import type { UserRole } from '@/database';
import { ApiError } from '@/exceptions';
import { getUserRole } from '@/utils';

export const roleMiddleware = (roles: UserRole[]) => async (c: Context, next: Next) => {
  const userRole = getUserRole(c);
  if (!roles.includes(userRole)) return c.json(ApiError.Forbidden().toJSON(), 403);

  await next();
};
