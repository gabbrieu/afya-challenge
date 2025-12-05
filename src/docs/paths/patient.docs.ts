export const patientPaths = {
  '/patients': {
    get: {
      tags: ['Pacientes'],
      summary: 'Listar pacientes',
      description: 'Lista paginada dos pacientes do médico logado.',
      security: [{ accessCookie: [] }],
      parameters: [
        {
          in: 'query',
          name: 'includeDeleted',
          schema: { type: 'boolean' },
          description: 'Se true, inclui pacientes anonimizados',
        },
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', minimum: 1 },
          description: 'Página (começa em 1)',
        },
        {
          in: 'query',
          name: 'pageSize',
          schema: { type: 'integer', minimum: 1, maximum: 100 },
          description: 'Itens por página',
        },
      ],
      responses: {
        200: {
          description: 'Lista de pacientes',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PaginatedPatients' } },
          },
        },
        401: {
          description: 'Não autenticado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        500: {
          description: 'Erro interno na listagem',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
    post: {
      tags: ['Pacientes'],
      summary: 'Criar paciente',
      description: 'Cadastra um novo paciente para o médico logado.',
      security: [{ accessCookie: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/CreatePatientRequest' } },
        },
      },
      responses: {
        201: {
          description: 'Paciente criado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Patient' } } },
        },
        400: {
          description: 'Payload inválido (validação)',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        401: {
          description: 'Não autenticado',
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
          description: 'Erro interno ao criar paciente',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
  '/patients/{id}': {
    patch: {
      tags: ['Pacientes'],
      summary: 'Atualizar paciente',
      description: 'Atualiza dados básicos do paciente. Todos os campos são opcionais.',
      security: [{ accessCookie: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Id do paciente',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/UpdatePatientRequest' } },
        },
      },
      responses: {
        200: {
          description: 'Paciente atualizado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Patient' } } },
        },
        400: {
          description: 'Id ou payload inválido',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        401: {
          description: 'Não autenticado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        404: {
          description: 'Paciente não encontrado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        409: {
          description: 'Email já usado por outro paciente',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        500: {
          description: 'Erro interno ao atualizar paciente',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
  '/patients/{id}/anonymize': {
    patch: {
      tags: ['Pacientes'],
      summary: 'Anonimizar paciente',
      description: 'Remove dados sensíveis do paciente e marca como deletado.',
      security: [{ accessCookie: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Id do paciente',
        },
      ],
      responses: {
        200: {
          description: 'Paciente anonimizado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Patient' } } },
        },
        400: {
          description: 'Id inválido',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        401: {
          description: 'Não autenticado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        404: {
          description: 'Paciente não encontrado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        500: {
          description: 'Erro interno ao anonimizar paciente',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
};
