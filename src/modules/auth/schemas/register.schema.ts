import { type InferOutput, minLength, object, pipe, string } from 'valibot'

const MIN_USERNAME_LEN = 3
const MIN_PASSWORD_LEN = 6
const MIN_FULLNAME_LEN = 8

export const RegisterSchema = object({
  password: pipe(
    string('Field must be a string'),
    minLength(MIN_PASSWORD_LEN, `Minimal password length: ${MIN_PASSWORD_LEN}`)
  ),
  fullName: pipe(
    string('Field must be a string'),
    minLength(MIN_FULLNAME_LEN, `Minimal fullName length: ${MIN_FULLNAME_LEN}`)
  ),
  userName: pipe(
    string('Field must be a string'),
    minLength(MIN_USERNAME_LEN, `Minimal userName length: ${MIN_USERNAME_LEN}`)
  )
})

export type RegisterData = InferOutput<typeof RegisterSchema>
