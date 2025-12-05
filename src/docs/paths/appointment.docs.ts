export const appointmentPaths = {
  '/appointments': {
    get: {
      tags: ['Consultas'],
      summary: 'Listar consultas',
      description: 'Lista consultas do médico logado com filtros simples.',
      security: [{ accessCookie: [] }],
      parameters: [
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
        {
          in: 'query',
          name: 'dateFrom',
          schema: { type: 'string', format: 'date-time' },
          description: 'Filtra início da agenda (ISO 8601)',
        },
        {
          in: 'query',
          name: 'dateTo',
          schema: { type: 'string', format: 'date-time' },
          description: 'Filtra fim da agenda (ISO 8601)',
        },
      ],
      responses: {
        200: {
          description: 'Lista de consultas',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PaginatedAppointments' } },
          },
        },
        400: {
          description: 'Datas dos filtros inválidas',
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
      },
    },
    post: {
      tags: ['Consultas'],
      summary: 'Agendar consulta',
      description: 'Cria uma consulta para o médico autenticado.',
      security: [{ accessCookie: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/CreateAppointmentRequest' } },
        },
      },
      responses: {
        201: {
          description: 'Consulta criada',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } },
        },
        400: {
          description: 'Dados inválidos',
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
          description: 'Conflito de horário',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
  '/appointments/{id}': {
    patch: {
      tags: ['Consultas'],
      summary: 'Atualizar consulta',
      description: 'Atualiza horário, paciente ou status da consulta do médico logado.',
      security: [{ accessCookie: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Id da consulta',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/UpdateAppointmentRequest' } },
        },
      },
      responses: {
        200: {
          description: 'Consulta atualizada',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } },
        },
        400: {
          description: 'Id ou dados inválidos',
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
          description: 'Consulta ou paciente não encontrados',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        409: {
          description: 'Conflito de consultas',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
    delete: {
      tags: ['Consultas'],
      summary: 'Cancelar consulta',
      description: 'Exclui a consulta do médico logado.',
      security: [{ accessCookie: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Id da consulta',
        },
      ],
      responses: {
        204: { description: 'Consulta removida' },
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
          description: 'Consulta não encontrada',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
  '/appointments/{id}/notes': {
    get: {
      tags: ['Consultas'],
      summary: 'Buscar nota',
      description: 'Retorna a nota da consulta, se existir.',
      security: [{ accessCookie: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Id da consulta',
        },
      ],
      responses: {
        200: {
          description: 'Nota encontrada',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } },
        },
        401: {
          description: 'Não autenticado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        404: {
          description: 'Nota não encontrada',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
    post: {
      tags: ['Consultas'],
      summary: 'Adicionar nota',
      description: 'Cria a nota da consulta (apenas uma por consulta).',
      security: [{ accessCookie: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Id da consulta',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/CreateNoteRequest' } },
        },
      },
      responses: {
        201: {
          description: 'Nota criada',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } },
        },
        401: {
          description: 'Não autenticado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        404: {
          description: 'Nota não encontrada',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        409: {
          description: 'Já existe nota para essa consulta',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
    patch: {
      tags: ['Consultas'],
      summary: 'Atualizar nota',
      description: 'Edita o texto da nota da consulta.',
      security: [{ accessCookie: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Id da consulta',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/UpdateNoteRequest' } },
        },
      },
      responses: {
        200: {
          description: 'Nota atualizada',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } },
        },
        401: {
          description: 'Não autenticado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        404: {
          description: 'Nota não encontrada',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
};
