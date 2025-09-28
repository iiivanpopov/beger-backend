import * as v from 'valibot'
import { config } from '@/config'

export const UpdateUserBody = v.object({
  userName: v.pipe(
    v.string('Field must be a string'),
    v.minLength(
      config.validation.MIN_USERNAME_LEN,
      `Minimal userName length: ${config.validation.MIN_USERNAME_LEN}`
    )
  ),
  fullName: v.pipe(
    v.string('Field must be a string'),
    v.minLength(
      config.validation.MIN_FULLNAME_LEN,
      `Minimal fullName length: ${config.validation.MIN_FULLNAME_LEN}`
    )
  )
})

export const UpdateUserParams = v.object({
  id: v.pipe(
    v.string('Field must be a string'),
    v.transform(input => Number(input))
  )
})

export type UpdateUserData = v.InferOutput<typeof UpdateUserBody>
