export const baseDoc = {
  openapi: '3.0.0',
  info: {
    title: 'Beger Backend API',
    version: '1.0.0',
    description: 'OpenAPI documentation for Beger Backend API'
  },
  servers: [{ url: '/api' }],
  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'accessToken' },
      refreshCookieAuth: { type: 'apiKey', in: 'cookie', name: 'refreshToken' }
    },
    parameters: {
      PaginationOffset: {
        in: 'query',
        name: 'offset',
        required: false,
        schema: { type: 'integer', minimum: 0, default: 0 },
        description: 'Pagination offset'
      },
      PaginationLimit: {
        in: 'query',
        name: 'limit',
        required: false,
        schema: { type: 'integer', minimum: 1, default: 10 },
        description: 'Pagination limit'
      }
    },
    schemas: {
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          fullName: { type: 'string' },
          userName: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin'] },
          createdAt: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'fullName', 'userName', 'role']
      },
      TokenPair: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' }
        },
        required: ['accessToken', 'refreshToken']
      },
      Repair: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          pcbName: { type: 'string' },
          defect: { type: 'string' },
          note: { type: ['string', 'null'] },
          date: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      TestResult: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          pcbName: { type: 'string' },
          passedFirstTry: { type: 'integer', minimum: 0 },
          failed: { type: 'integer', minimum: 0 },
          total: { type: 'integer', minimum: 0 },
          date: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      OptionsResponse: {
        type: 'object',
        additionalProperties: { type: 'array', items: { type: 'string' } }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        tags: ['System'],
        responses: { '200': { description: 'OK' } }
      }
    }
  }
} as const
