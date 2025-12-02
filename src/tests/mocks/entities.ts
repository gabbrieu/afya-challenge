import { AppointmentStatusEnum, type AppointmentEntity } from '#entities/appointment.entity';
import type { MedicEntity, MedicEntityWithoutPassword } from '#entities/medic.entity';
import type { NoteEntity } from '#entities/note.entity';
import { GenderEnum, type PatientEntity } from '#entities/patient.entity';
import { DateTime } from 'luxon';

const now = DateTime.fromISO('2025-01-01T10:00:00.000Z') as DateTime<true>;

export const makePatientEntity = (overrides: Partial<PatientEntity> = {}): PatientEntity => ({
  id: 1,
  name: 'Paciente Exemplo',
  email: 'paciente@example.com',
  cellphone: '11999999999',
  birthDate: DateTime.fromISO('1990-01-01'),
  sex: GenderEnum.FEMALE,
  height: 170,
  weight: 700,
  createdAt: now,
  updatedAt: now,
  deletedAt: null,
  ...overrides,
});

export const makeAppointmentEntity = (
  overrides: Partial<AppointmentEntity> = {},
): AppointmentEntity => ({
  id: 10,
  medicId: 1,
  patientId: 1,
  startAt: now.plus({ days: 1 }),
  endAt: now.plus({ days: 1, hours: 1 }),
  status: AppointmentStatusEnum.SCHEDULED,
  createdAt: now,
  updatedAt: now,
  ...overrides,
});

export const makeMedicEntity = (overrides: Partial<MedicEntity> = {}): MedicEntity => ({
  id: 99,
  email: 'medic@example.com',
  password: 'hashed-password',
  createdAt: now,
  updatedAt: now,
  ...overrides,
});

export const makeMedicEntityWithoutPassword = (
  overrides: Partial<MedicEntityWithoutPassword> = {},
): MedicEntityWithoutPassword => {
  const { password: _password, ...rest } = makeMedicEntity(overrides);
  void _password;
  return rest;
};

export const makeNoteEntity = (overrides: Partial<NoteEntity> = {}): NoteEntity => ({
  id: 123,
  appointmentId: 10,
  medicId: 1,
  content: 'Nota de evolução do paciente.',
  createdAt: now,
  updatedAt: now,
  ...overrides,
});
