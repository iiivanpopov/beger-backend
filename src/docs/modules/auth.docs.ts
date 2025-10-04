export const authDocs = {
  components: {
    schemas: {
      LoginBody: {
        type: 'object',
        properties: {
          userName: { type: 'string', minLength: 3 },
          password: { type: 'string', minLength: 6 },
        },
        required: ['userName', 'password'],
      },
      RegisterBody: {
        type: 'object',
        properties: {
          userName: { type: 'string', minLength: 3 },
          password: { type: 'string', minLength: 6 },
          fullName: { type: 'string', minLength: 8 },
        },
        required: ['userName', 'password', 'fullName'],
      },
    },
  },
  paths: {
    '/auth/login': {
      post: {
        summary: 'Login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginBody' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Logged in',
            headers: {
              'Set-Cookie': {
                description: 'Sets accessToken and refreshToken cookies',
              },
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/TokenPair' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register user',
        description: 'Requires admin role',
        tags: ['Auth'],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterBody' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'Logout',
        tags: ['Auth'],
        security: [{ refreshCookieAuth: [] }],
        responses: {
          '200': {
            description: 'Logged out',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        summary: 'Refresh tokens',
        tags: ['Auth'],
        security: [{ refreshCookieAuth: [] }],
        responses: {
          '200': {
            description: 'Tokens refreshed',
            headers: {
              'Set-Cookie': {
                description: 'Sets new accessToken and refreshToken cookies',
              },
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/TokenPair' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
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
