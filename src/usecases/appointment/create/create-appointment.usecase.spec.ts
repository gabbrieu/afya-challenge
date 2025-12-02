import type { AppointmentRepository } from '#repositories/appointment-repository.interface';
import type { PatientRepository } from '#repositories/patient-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeAppointmentEntity, makePatientEntity } from '#tests/mocks/entities';
import type { MockedRepository } from '#tests/types';
import { CreateAppointmentUseCase } from '#usecases/appointment/create/create-appointment.usecase';
import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('CreateAppointmentUseCase', () => {
  const appointmentRepository: MockedRepository<AppointmentRepository> = {
    hasOverlap: vi.fn(),
    create: vi.fn(),
    listByMedic: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const patientRepository: MockedRepository<PatientRepository> = {
    findUnique: vi.fn(),
    create: vi.fn(),
    getAll: vi.fn(),
    update: vi.fn(),
    anonymize: vi.fn(),
  };
  const medicId = 10;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T10:00:00.000Z'));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve criar uma consulta quando dados são válidos e não há conflito', async () => {
    patientRepository.findUnique.mockResolvedValue(makePatientEntity());
    appointmentRepository.hasOverlap.mockResolvedValue(false);

    const payload = {
      patientId: 1,
      startAt: '2025-01-02T10:00:00.000Z',
      endAt: '2025-01-02T11:00:00.000Z',
    };
    const start = DateTime.fromISO(payload.startAt);
    const end = DateTime.fromISO(payload.endAt);
    const created = makeAppointmentEntity({
      id: 123,
      medicId,
      patientId: payload.patientId,
      startAt: start,
      endAt: end,
    });
    appointmentRepository.create.mockResolvedValue(created);

    const useCase = new CreateAppointmentUseCase(appointmentRepository, patientRepository);
    const response = await useCase.execute(medicId, payload);

    expect(appointmentRepository.hasOverlap).toHaveBeenCalledWith({
      medicId,
      startAt: new Date(payload.startAt),
      endAt: new Date(payload.endAt),
    });
    expect(appointmentRepository.create).toHaveBeenCalledWith(medicId, payload);
    expect(response).toStrictEqual(created);
  });

  it('deve lançar 404 quando o paciente não existe', async () => {
    patientRepository.findUnique.mockResolvedValue(undefined);

    const payload = {
      patientId: 99,
      startAt: '2025-01-02T10:00:00.000Z',
      endAt: '2025-01-02T11:00:00.000Z',
    };

    const useCase = new CreateAppointmentUseCase(appointmentRepository, patientRepository);
    const response = useCase.execute(medicId, payload);

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: 'Paciente não encontrado',
      statusCode: HttpStatusCode.NOT_FOUND,
    });
  });

  it('deve validar datas ISO', async () => {
    patientRepository.findUnique.mockResolvedValue(makePatientEntity());

    const payload = { patientId: 1, startAt: 'invalid', endAt: 'invalid' };
    const useCase = new CreateAppointmentUseCase(appointmentRepository, patientRepository);
    const response = useCase.execute(medicId, payload);

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: 'Datas de agendamento inválidas',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });

  it('deve exigir endAt maior que startAt', async () => {
    patientRepository.findUnique.mockResolvedValue(makePatientEntity());

    const payload = {
      patientId: 1,
      startAt: '2025-01-02T10:00:00.000Z',
      endAt: '2025-01-02T09:00:00.000Z',
    };
    const useCase = new CreateAppointmentUseCase(appointmentRepository, patientRepository);
    const response = useCase.execute(medicId, payload);

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: 'A data/hora de término deve ser maior que a de início',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });

  it('não deve permitir agendamento no passado', async () => {
    patientRepository.findUnique.mockResolvedValue(makePatientEntity());

    const payload = {
      patientId: 1,
      startAt: '2023-12-31T10:00:00.000Z',
      endAt: '2023-12-31T11:00:00.000Z',
    };
    const useCase = new CreateAppointmentUseCase(appointmentRepository, patientRepository);
    const response = useCase.execute(medicId, payload);

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: 'Não dá para agendar consultas no passado',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });

  it('deve falhar quando já existe consulta no intervalo', async () => {
    patientRepository.findUnique.mockResolvedValue(makePatientEntity());
    appointmentRepository.hasOverlap.mockResolvedValue(true);

    const payload = {
      patientId: 1,
      startAt: '2025-01-02T10:00:00.000Z',
      endAt: '2025-01-02T11:00:00.000Z',
    };
    const useCase = new CreateAppointmentUseCase(appointmentRepository, patientRepository);
    const response = useCase.execute(medicId, payload);

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(useCase.execute(medicId, payload)).rejects.toMatchObject({
      message: 'Já existe consulta para este médico no intervalo informado',
      statusCode: HttpStatusCode.CONFLICT,
    });
  });
});
