// oxlint-disable-next-line no-unused-vars
import { config } from '@/config'
import { authDoc } from '@/modules/auth/auth.doc'
import { optionsDoc } from '@/modules/options/options.doc'
import { repairsDoc } from '@/modules/repairs/repair.doc'
import { testResultsDoc } from '@/modules/test-results/test-result.doc'
import { usersDoc } from '@/modules/users/users.doc'
import { baseDoc } from './base.doc'

export const composeDocs = (...docs: any[]) => {
  const mergedPaths = docs.reduce((acc, doc) => ({ ...acc, ...doc?.paths }), {})
  const mergedSchemas = docs.reduce(
    (acc, doc) => ({ ...acc, ...doc?.components?.schemas }),
    {}
  )

  return {
    ...baseDoc,
    paths: { ...baseDoc.paths, ...mergedPaths },
    components: {
      ...baseDoc.components,
      schemas: { ...baseDoc.components.schemas, ...mergedSchemas }
    }
  }
}

export const openApiDocs = composeDocs(
  authDoc,
  usersDoc,
  repairsDoc,
  testResultsDoc,
  optionsDoc
)
