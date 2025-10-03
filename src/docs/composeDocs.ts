export const composeDocs = (...docs: any[]) => {
  const mergedPaths = docs.reduce((acc, doc) => ({ ...acc, ...doc?.paths }), {})
  const mergedSchemas = docs.reduce(
    (acc, doc) => ({ ...acc, ...doc?.components?.schemas }),
    {}
  )

  return {
    openapi: '3.0.0',
    info: {
      title: 'Beger Backend API',
      version: '1.0.0',
      description: 'OpenAPI documentation for Beger Backend API'
    },
    servers: [{ url: '/api' }],
    paths: mergedPaths,
    components: {
      schemas: mergedSchemas
    }
  }
}