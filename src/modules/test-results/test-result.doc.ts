export const testResultsDoc = {
  components: {
    schemas: {
      CreateTestResultBody: {
        type: 'object',
        properties: {
          pcbName: { type: 'string', minLength: 1, maxLength: 255 },
          passedFirstTry: { type: 'integer', minimum: 0 },
          failed: { type: 'integer', minimum: 0 },
          total: { type: 'integer', minimum: 0 },
          date: { type: 'string', format: 'date-time' }
        },
        required: ['pcbName', 'passedFirstTry', 'failed', 'total', 'date']
      }
    }
  },
  paths: {
    '/records/test-results/me': {
      get: {
        summary: 'List my test results (last 24h, max 10)',
        tags: ['Test Results'],
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Test results',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/TestResult' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/records/test-results': {
      get: {
        summary: 'List test results (admin)',
        tags: ['Test Results'],
        security: [{ cookieAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/PaginationOffset' },
          { $ref: '#/components/parameters/PaginationLimit' }
        ],
        responses: {
          '200': {
            description: 'Test results',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/TestResult' }
                    }
                  }
                }
              }
            }
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create test result',
        tags: ['Test Results'],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTestResultBody' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/TestResult' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/records/test-results/{id}': {
      delete: {
        summary: 'Delete test result (self last 24h or admin)',
        tags: ['Test Results'],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          },
          '404': {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    }
  }
}
