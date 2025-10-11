import type { InferOutput } from 'valibot'
import { object } from 'valibot'
import { fullNameValidation, userNameValidation } from '@/utils'

export const UpdateUserBody = object({
  userName: userNameValidation,
  fullName: fullNameValidation,
})

export type UpdateUserData = InferOutput<typeof UpdateUserBody>
