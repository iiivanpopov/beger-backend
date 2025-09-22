import * as v from 'valibot'

export const DeleteUserSchema = v.object({
  id: v.pipe(
    v.string('Field must be a string'),
    v.transform(input => Number(input))
  )
})

export type DeleteUserData = v.InferOutput<typeof DeleteUserSchema>
