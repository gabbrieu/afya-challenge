export const authPaths = {
  '/auth/login': {
    post: {
      tags: ['Autenticação'],
      summary: 'Login do médico',
      description:
        'Autentica com email e senha. Se der certo, grava cookies para login e renovação do token.',
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } },
        },
      },
      responses: {
        200: {
          description: 'Login ok',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/TokenPair' } },
          },
        },
        400: {
          description: 'Payload inválido',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        401: {
          description: 'Credenciais erradas',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        500: {
          description: 'Erro interno no login',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
  '/auth/logout': {
    post: {
      tags: ['Autenticação'],
      summary: 'Logout',
      description: 'Limpa os cookies de autenticação e finaliza a sessão.',
      security: [{ accessCookie: [] }],
      responses: {
        204: { description: 'Sessão encerrada' },
        401: {
          description: 'Não autenticado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        500: {
          description: 'Erro interno no logout',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
  '/auth/refresh': {
    post: {
      tags: ['Autenticação'],
      summary: 'Renovar tokens',
      description: 'Gera novo par de tokens usando o cookie de refresh token.',
      security: [{ refreshCookie: [] }],
      responses: {
        200: {
          description: 'Tokens renovados',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/TokenPair' } },
          },
        },
        401: {
          description: 'Refresh inválido ou ausente',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        500: {
          description: 'Erro interno ao renovar token',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
  '/me': {
    get: {
      tags: ['Autenticação'],
      summary: 'Quem sou eu',
      description: 'Retorna o payload do token atual.',
      security: [{ accessCookie: [] }],
      responses: {
        200: {
          description: 'Payload do token',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/JWTPayload' } } },
        },
        401: {
          description: 'Não autenticado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        500: {
          description: 'Erro interno ao consultar payload',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
};
