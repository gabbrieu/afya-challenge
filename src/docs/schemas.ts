export const components = {
  securitySchemes: {
    accessCookie: {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
      description:
        'Token de acesso enviado em cookie httpOnly após o login. Use esse esquema para rotas protegidas.',
    },
    refreshCookie: {
      type: 'apiKey',
      in: 'cookie',
      name: 'refreshToken',
      description: 'Cookie httpOnly de refresh usado para gerar novos tokens.',
    },
  },
  schemas: {
    ErrorResponse: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Mensagem de erro' },
      },
    },
    Pagination: {
      type: 'object',
      properties: {
        total: { type: 'integer', example: 42 },
        page: { type: 'integer', example: 1 },
        pageSize: { type: 'integer', example: 10 },
      },
    },
    LoginRequest: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email', example: 'medico@afya.com' },
        password: { type: 'string', minLength: 4, example: 'senha123' },
      },
    },
    TokenPair: {
      type: 'object',
      properties: {
        accessTtlMs: { type: 'integer', example: 300000 },
        refreshTtlMs: { type: 'integer', example: 604800000 },
      },
    },
    Medic: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        email: { type: 'string', example: 'medico@afya.com' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    CreateMedicRequest: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email', example: 'medico@afya.com' },
        password: { type: 'string', minLength: 4, example: 'senha123' },
      },
    },
    Patient: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 10 },
        name: { type: 'string', nullable: true, example: 'Maria Souza' },
        cellphone: { type: 'string', nullable: true, example: '11999999999' },
        email: { type: 'string', nullable: true, example: 'maria@email.com' },
        birthDate: { type: 'string', format: 'date-time', nullable: true },
        sex: {
          type: 'string',
          nullable: true,
          enum: ['MALE', 'FEMALE', 'OTHERS', 'NOT_INFORM'],
        },
        height: { type: 'number', nullable: true, example: 1.65 },
        weight: { type: 'number', nullable: true, example: 63.5 },
        deletedAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    CreatePatientRequest: {
      type: 'object',
      required: ['name', 'cellphone', 'email', 'birthDate', 'sex', 'height', 'weight'],
      properties: {
        name: { type: 'string', minLength: 3, maxLength: 100, example: 'Maria Souza' },
        cellphone: { type: 'string', maxLength: 11, example: '11999999999' },
        email: { type: 'string', format: 'email', example: 'maria@email.com' },
        birthDate: { type: 'string', format: 'date', example: '1995-05-20' },
        sex: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHERS', 'NOT_INFORM'] },
        height: { type: 'number', maximum: 99.99, minimum: 0, example: 1.65 },
        weight: { type: 'number', maximum: 999.99, minimum: 0, example: 63.5 },
      },
    },
    UpdatePatientRequest: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 3, maxLength: 100 },
        cellphone: { type: 'string', maxLength: 11 },
        email: { type: 'string', format: 'email' },
        birthDate: { type: 'string', format: 'date' },
        sex: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHERS', 'NOT_INFORM'] },
        height: { type: 'number', maximum: 99.99, minimum: 0 },
        weight: { type: 'number', maximum: 999.99, minimum: 0 },
      },
    },
    Appointment: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 30 },
        medicId: { type: 'integer', example: 1 },
        patientId: { type: 'integer', example: 10 },
        startAt: { type: 'string', format: 'date-time', example: '2024-11-15T14:00:00Z' },
        endAt: { type: 'string', format: 'date-time', example: '2024-11-15T14:30:00Z' },
        status: { type: 'string', enum: ['SCHEDULED', 'COMPLETED', 'CANCELED'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    CreateAppointmentRequest: {
      type: 'object',
      required: ['patientId', 'startAt', 'endAt'],
      properties: {
        patientId: { type: 'integer', minimum: 1, example: 10 },
        startAt: { type: 'string', format: 'date-time', example: '2024-11-15T14:00:00Z' },
        endAt: { type: 'string', format: 'date-time', example: '2024-11-15T14:30:00Z' },
      },
    },
    UpdateAppointmentRequest: {
      type: 'object',
      properties: {
        patientId: { type: 'integer', minimum: 1 },
        startAt: { type: 'string', format: 'date-time' },
        endAt: { type: 'string', format: 'date-time' },
        status: { type: 'string', enum: ['SCHEDULED', 'COMPLETED', 'CANCELED'] },
      },
    },
    Note: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 5 },
        appointmentId: { type: 'integer', example: 30 },
        medicId: { type: 'integer', example: 1 },
        content: {
          type: 'string',
          maxLength: 1000,
          example: 'Paciente chegou bem, relatou melhora após últimos exames.',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    CreateNoteRequest: {
      type: 'object',
      required: ['content'],
      properties: {
        content: {
          type: 'string',
          maxLength: 1000,
          example: 'Paciente chegou bem, relatou melhora após últimos exames.',
        },
      },
    },
    UpdateNoteRequest: {
      type: 'object',
      required: ['content'],
      properties: {
        content: {
          type: 'string',
          maxLength: 1000,
          example: 'Ajustei a medicação e marquei retorno em 15 dias.',
        },
      },
    },
    JWTPayload: {
      type: 'object',
      properties: {
        sub: { type: 'string', description: 'Id do médico autenticado', example: '1' },
        email: { type: 'string', format: 'email', example: 'medico@afya.com' },
        iat: { type: 'integer', description: 'Emitido em (timestamp)' },
        exp: { type: 'integer', description: 'Expira em (timestamp)' },
      },
    },
    PaginatedPatients: {
      allOf: [
        { $ref: '#/components/schemas/Pagination' },
        {
          type: 'object',
          properties: {
            data: { type: 'array', items: { $ref: '#/components/schemas/Patient' } },
          },
        },
      ],
    },
    PaginatedAppointments: {
      allOf: [
        { $ref: '#/components/schemas/Pagination' },
        {
          type: 'object',
          properties: {
            data: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } },
          },
        },
      ],
    },
  },
};
