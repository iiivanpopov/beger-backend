import * as v from 'valibot'
import { config } from '@/config'

export const CreateRepairBody = v.object({
  pcbName: v.pipe(
    v.string('Field must be a string'),
    v.minLength(
      config.validation.MIN_PCB_NAME_LEN,
      `Minimal pcbName length: ${config.validation.MIN_PCB_NAME_LEN}`
    ),
    v.maxLength(255, 'Max pcbName length: 255')
  ),
  defect: v.pipe(
    v.string('Field must be a string'),
    v.minLength(
      config.validation.MIN_DEFECT_LEN,
      `Minimal defect length: ${config.validation.MIN_DEFECT_LEN}`
    )
  ),
  note: v.optional(
    v.nullable(
      v.pipe(
        v.string('Field must be a string'),
        v.maxLength(255, 'Max note length: 255')
      )
    ),
    null
  ),
  date: v.pipe(
    v.string('Field must be a string'),
    v.transform((input: string) => new Date(input)),
    v.date('Field must be a valid date')
  )
})

export type CreateRepairData = v.InferOutput<typeof CreateRepairBody>
