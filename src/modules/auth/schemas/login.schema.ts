import { type InferOutput, minLength, object, pipe, string } from 'valibot'
import { MIN_PASSWORD_LEN, MIN_USERNAME_LEN } from './schemas.config'

export const LoginSchema = object({
  userName: pipe(
    string('Field must be a string'),
    minLength(MIN_USERNAME_LEN, `Minimal userName length: ${MIN_USERNAME_LEN}`)
  ),
  password: pipe(
    string('Field must be a string'),
    minLength(MIN_PASSWORD_LEN, `Minimal password length: ${MIN_PASSWORD_LEN}`)
  )
})

export type LoginData = InferOutput<typeof LoginSchema>
