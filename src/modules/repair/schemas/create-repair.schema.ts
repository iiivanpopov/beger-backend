import {
  date,
  type InferOutput,
  maxLength,
  minLength,
  nullable,
  object,
  optional,
  pipe,
  string,
  transform
} from 'valibot'

const MIN_PCB_NAME_LEN = 1
const MIN_DEFECT_LEN = 1

export const CreateRepairSchema = object({
  pcbName: pipe(
    string('Field must be a string'),
    minLength(MIN_PCB_NAME_LEN, `Minimal pcbName length: ${MIN_PCB_NAME_LEN}`),
    maxLength(255, 'Max pcbName length: 255')
  ),
  defect: pipe(
    string('Field must be a string'),
    minLength(MIN_DEFECT_LEN, `Minimal defect length: ${MIN_DEFECT_LEN}`)
  ),
  note: optional(
    nullable(
      pipe(
        string('Field must be a string'),
        maxLength(255, 'Max note length: 255')
      )
    ),
    null
  ),
  date: pipe(
    string('Field must be a string'),
    transform((input: string) => new Date(input)),
    date('Field must be a valid date')
  )
})

export type CreateRepairData = InferOutput<typeof CreateRepairSchema>
