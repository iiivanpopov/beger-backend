export const repairsDoc = {
  components: {
    schemas: {
      CreateRepairBody: {
        type: 'object',
        properties: {
          pcbName: { type: 'string', minLength: 1, maxLength: 255 },
          defect: { type: 'string', minLength: 1 },
          note: { type: ['string', 'null'], maxLength: 255 },
          date: { type: 'string', format: 'date-time' },
        },
        required: ['pcbName', 'defect', 'date'],
      },
    },
  },
  paths: {
    '/records/repairs/me': {
      get: {
        summary: 'List my repairs (last 24h, max 10)',
        tags: ['Repairs'],
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Repairs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Repair' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/records/repairs': {
      get: {
        summary: 'List repairs (admin)',
        tags: ['Repairs'],
        security: [{ cookieAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/PaginationOffset' },
          { $ref: '#/components/parameters/PaginationLimit' },
        ],
        responses: {
          '200': {
            description: 'Repairs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Repair' },
                    },
                  },
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create repair',
        tags: ['Repairs'],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateRepairBody' },
            },
          },
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
                    data: { $ref: '#/components/schemas/Repair' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/records/repairs/{id}': {
      delete: {
        summary: 'Delete repair (self last 24h or admin)',
        tags: ['Repairs'],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '404': {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};
