import { baseDocs } from './base.docs';
import { authDocs } from './modules/auth.docs';
import { optionsDocs } from './modules/options.docs';
import { repairsDocs } from './modules/repair.docs';
import { testResultsDocs } from './modules/test-result.docs';
import { usersDocs } from './modules/users.docs';

const composeDocs = (...docs: any[]) => {
  const paths: Record<string, any> = {};
  const schemas: Record<string, any> = {};

  for (const d of docs) {
    if (d?.paths) Object.assign(paths, d.paths);
    if (d?.components?.schemas) Object.assign(schemas, d.components.schemas);
  }

  return {
    openapi: '3.0.0',
    info: {
      title: 'Beger Backend API',
      version: '1.0.0',
      description: 'OpenAPI documentation for Beger Backend API',
    },
    servers: [{ url: '/api' }],
    paths,
    components: { schemas },
  };
};

export const openApiDocs = composeDocs(
  baseDocs,
  authDocs,
  usersDocs,
  repairsDocs,
  testResultsDocs,
  optionsDocs
);
