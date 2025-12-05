import { appointmentPaths } from './paths/appointment.docs.js';
import { authPaths } from './paths/auth.docs.js';
import { medicPaths } from './paths/medic.docs.js';
import { patientPaths } from './paths/patient.docs.js';
import { components } from './schemas.js';

const { default: settings } = await import('../../package.json', {
  with: { type: 'json' },
});

const paths = {
  ...authPaths,
  ...medicPaths,
  ...patientPaths,
  ...appointmentPaths,
};

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API - Afya Challenge',
    version: settings.version,
    description: 'Documentação em português para autenticação, pacientes e consultas.',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Ambiente local' }],
  tags: [
    { name: 'Autenticação', description: 'Login, refresh e payload atual' },
    { name: 'Médicos', description: 'Cadastro aberto de médicos' },
    { name: 'Pacientes', description: 'CRUD básico de pacientes' },
    { name: 'Consultas', description: 'Agendamentos e notas' },
  ],
  components,
  paths,
};
