import * as v from 'valibot'

export const DeleteTestResultParams = v.object({
  id: v.pipe(
    v.string('Field must be a string'),
    v.transform(input => Number(input))
  )
})
