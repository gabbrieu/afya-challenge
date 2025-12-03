import type { AppointmentRepository } from '#repositories/appointment-repository.interface';
import type { MedicRepository } from '#repositories/medic-repository.interface';
import type { NoteRepository } from '#repositories/note-repository.interface';
import type { PatientRepository } from '#repositories/patient-repository.interface';
import type { MockedDependencies } from '#tests/types';
import { vi } from 'vitest';

export const appointmentRepositoryMock: MockedDependencies<AppointmentRepository> = {
  create: vi.fn(),
  hasOverlap: vi.fn(),
  listByMedic: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

export const patientRepositoryMock: MockedDependencies<PatientRepository> = {
  findUnique: vi.fn(),
  create: vi.fn(),
  getAll: vi.fn(),
  update: vi.fn(),
  anonymize: vi.fn(),
};

export const noteRepositoryMock: MockedDependencies<NoteRepository> = {
  create: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
};

export const medicRepositoryMock: MockedDependencies<MedicRepository> = {
  findUnique: vi.fn(),
  create: vi.fn(),
};
