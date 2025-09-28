import * as v from 'valibot'

export const PaginationQuery = v.object({
  offset: v.optional(
    v.pipe(
      v.string('Field must be a string'),
      v.transform(input => Number(input)),
      v.minValue(0, 'Must be >= 0')
    ),
    '0'
  ),
  limit: v.optional(
    v.pipe(
      v.string('Field must be a string'),
      v.transform(input => Number(input)),
      v.minValue(1, 'Must be >= 1')
    ),
    '10'
  )
})

export const IdParam = v.object({
  id: v.pipe(
    v.string('Field must be a string'),
    v.transform(input => Number(input))
  )
})
