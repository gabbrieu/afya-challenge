export const medicPaths = {
  '/medics': {
    post: {
      tags: ['Médicos'],
      summary: 'Cadastrar médico',
      description: 'Rota aberta para registrar um médico novo e depois fazer login.',
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/CreateMedicRequest' } },
        },
      },
      responses: {
        201: {
          description: 'Médico criado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Medic' } } },
        },
        400: {
          description: 'Payload inválido (validação)',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        409: {
          description: 'Email já usado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        500: {
          description: 'Erro interno ao criar médico',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
};
