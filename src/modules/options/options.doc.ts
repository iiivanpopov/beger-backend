export const optionsDoc = {
  components: {
    schemas: {
      OptionsResponse: {
        type: 'object',
        properties: {
          pcb: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          defect: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  paths: {
    '/options': {
      get: {
        summary: 'Get options (cached)',
        tags: ['Options'],
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Options',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/OptionsResponse' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
