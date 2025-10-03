import { authDoc } from '@/modules/auth/auth.doc'
import { optionsDoc } from '@/modules/options/options.doc'
import { repairsDoc } from '@/modules/repairs/repair.doc'
import { testResultsDoc } from '@/modules/test-results/test-result.doc'
import { usersDoc } from '@/modules/users/users.doc'
import { composeDocs } from './composeDocs'
import { baseDoc } from './base.doc'

export const openApiDocs = composeDocs(
  baseDoc,
  authDoc,
  usersDoc,
  repairsDoc,
  testResultsDoc,
  optionsDoc
)
