import {
  date,
  type InferOutput,
  maxLength,
  minLength,
  minValue,
  number,
  object,
  pipe,
  string,
  transform
} from 'valibot'

const MIN_PCB_NAME_LEN = 1

export const CreateTestResultSchema = object({
  pcbName: pipe(
    string('Field must be a string'),
    minLength(MIN_PCB_NAME_LEN, `Minimal pcbName length: ${MIN_PCB_NAME_LEN}`),
    maxLength(255, 'Max pcbName length: 255')
  ),
  passedFirstTry: pipe(
    number('Field must be a number'),
    minValue(0, 'Must be >= 0')
  ),
  failed: pipe(number('Field must be a number'), minValue(0, 'Must be >= 0')),
  total: pipe(number('Field must be a number'), minValue(0, 'Must be >= 0')),
  date: pipe(
    string('Field must be a string'),
    transform((input: string) => new Date(input)),
    date('Field must be a valid date')
  )
})

export type CreateTestResultData = InferOutput<typeof CreateTestResultSchema>
