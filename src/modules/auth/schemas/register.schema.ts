import { type InferOutput, minLength, object, pipe, string } from 'valibot'
import {
  MIN_FULLNAME_LEN,
  MIN_PASSWORD_LEN,
  MIN_USERNAME_LEN
} from './schemas.config'

export const RegisterSchema = object({
  userName: pipe(
    string('Field must be a string'),
    minLength(MIN_USERNAME_LEN, `Minimal userName length: ${MIN_USERNAME_LEN}`)
  ),
  password: pipe(
    string('Field must be a string'),
    minLength(MIN_PASSWORD_LEN, `Minimal password length: ${MIN_PASSWORD_LEN}`)
  ),
  fullName: pipe(
    string('Field must be a string'),
    minLength(MIN_FULLNAME_LEN, `Minimal fullName length: ${MIN_FULLNAME_LEN}`)
  )
})

export type RegisterData = InferOutput<typeof RegisterSchema>
