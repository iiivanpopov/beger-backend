import * as v from 'valibot'

export const DeleteTestResultSchema = v.object({
  id: v.pipe(
    v.string('Field must be a string'),
    v.transform(input => Number(input))
  )
})

export type DeleteTestResultData = v.InferOutput<typeof DeleteTestResultSchema>
