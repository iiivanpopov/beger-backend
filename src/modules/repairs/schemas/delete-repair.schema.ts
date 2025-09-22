import * as v from 'valibot'

export const DeleteRepairSchema = v.object({
  id: v.pipe(
    v.string('Field must be a string'),
    v.transform(input => Number(input))
  )
})

export type DeleteRepairData = v.InferOutput<typeof DeleteRepairSchema>
