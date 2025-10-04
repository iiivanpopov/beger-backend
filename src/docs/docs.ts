import { authDoc } from '@/modules/auth/auth.doc';
import { optionsDoc } from '@/modules/options/options.doc';
import { repairsDoc } from '@/modules/repairs/repair.doc';
import { testResultsDoc } from '@/modules/test-results/test-result.doc';
import { usersDoc } from '@/modules/users/users.doc';
import { baseDoc } from './base.doc';

const composeDocs = (...docs: any[]) => {
  const mergedPaths = docs.reduce((acc, doc) => ({ ...acc, ...doc?.paths }), {});
  const mergedSchemas = docs.reduce((acc, doc) => ({ ...acc, ...doc?.components?.schemas }), {});

  return {
    openapi: '3.0.0',
    info: {
      title: 'Beger Backend API',
      version: '1.0.0',
      description: 'OpenAPI documentation for Beger Backend API',
    },
    servers: [{ url: '/api' }],
    paths: mergedPaths,
    components: {
      schemas: mergedSchemas,
    },
  };
};

export const openApiDocs = composeDocs(
  baseDoc,
  authDoc,
  usersDoc,
  repairsDoc,
  testResultsDoc,
  optionsDoc
);
