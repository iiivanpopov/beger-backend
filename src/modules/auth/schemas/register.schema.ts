import type { InferOutput } from 'valibot'
import { minLength, object, pipe, string } from 'valibot'
import { config } from '@/config'

export const RegisterBody = object({
  userName: pipe(string(), minLength(config.validation.MIN_USERNAME_LEN)),
  password: pipe(string(), minLength(config.validation.MIN_PASSWORD_LEN)),
  fullName: pipe(string(), minLength(config.validation.MIN_FULLNAME_LEN)),
})

export type RegisterData = InferOutput<typeof RegisterBody>
