import * as v from 'valibot';
import { config } from '@/config';

export const LoginBody = v.object({
  userName: v.pipe(
    v.string('Field must be a string'),
    v.minLength(
      config.validation.MIN_USERNAME_LEN,
      `Minimal userName length: ${config.validation.MIN_USERNAME_LEN}`
    )
  ),
  password: v.pipe(
    v.string('Field must be a string'),
    v.minLength(
      config.validation.MIN_PASSWORD_LEN,
      `Minimal password length: ${config.validation.MIN_PASSWORD_LEN}`
    )
  ),
});

export type LoginData = v.InferOutput<typeof LoginBody>;
