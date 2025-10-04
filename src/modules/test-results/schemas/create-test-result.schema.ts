import * as v from 'valibot';
import { config } from '@/config';

export const CreateTestResultBody = v.object({
  pcbName: v.pipe(
    v.string('Field must be a string'),
    v.minLength(
      config.validation.MIN_PCB_NAME_LEN,
      `Minimal pcbName length: ${config.validation.MIN_PCB_NAME_LEN}`
    ),
    v.maxLength(255, 'Max pcbName length: 255')
  ),
  passedFirstTry: v.pipe(v.number('Field must be a number'), v.minValue(0, 'Must be >= 0')),
  failed: v.pipe(v.number('Field must be a number'), v.minValue(0, 'Must be >= 0')),
  total: v.pipe(v.number('Field must be a number'), v.minValue(0, 'Must be >= 0')),
  date: v.pipe(
    v.string('Field must be a string'),
    v.transform((input: string) => new Date(input)),
    v.date('Field must be a valid date')
  ),
});

export type CreateTestResultData = v.InferOutput<typeof CreateTestResultBody>;
