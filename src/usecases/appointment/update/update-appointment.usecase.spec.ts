import type { AppointmentRepository } from '#repositories/appointment-repository.interface';
import type { PatientRepository } from '#repositories/patient-repository.interface';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeAppointmentEntity, makePatientEntity } from '#tests/mocks/entities';
import type { MockedRepository } from '#tests/types';
import { UpdateAppointmentUseCase } from '#usecases/appointment/update/update-appointment.usecase';
import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('UpdateAppointmentUseCase', () => {
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

  const useCase = new UpdateAppointmentUseCase(appointmentRepository, patientRepository);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T10:00:00.000Z'));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve atualizar uma consulta válida', async () => {
    const existing = makeAppointmentEntity({ id: 1, medicId: 10 });
    appointmentRepository.findUnique.mockResolvedValue(existing);
    appointmentRepository.hasOverlap.mockResolvedValue(false);
    patientRepository.findUnique.mockResolvedValue(makePatientEntity());

    const payload = {
      startAt: '2025-01-02T10:00:00.000Z',
      endAt: '2025-01-02T11:00:00.000Z',
      patientId: 1,
    };
    const updated = makeAppointmentEntity({
      ...existing,
      startAt: DateTime.fromISO(payload.startAt),
      endAt: DateTime.fromISO(payload.endAt),
    });
    appointmentRepository.update.mockResolvedValue(updated);

    const response = await useCase.execute(1, 10, payload);

    expect(appointmentRepository.hasOverlap).toHaveBeenCalledWith({
      medicId: 10,
      startAt: DateTime.fromISO(payload.startAt).toJSDate(),
      endAt: DateTime.fromISO(payload.endAt).toJSDate(),
      ignoreAppointmentId: 1,
    });
    expect(appointmentRepository.update).toHaveBeenCalledWith(1, 10, {
      ...payload,
      startAt: DateTime.fromISO(payload.startAt).toISO(),
      endAt: DateTime.fromISO(payload.endAt).toISO(),
    });
    expect(response).toStrictEqual(updated);
  });

  it('deve lançar 404 se consulta não existir', async () => {
    appointmentRepository.findUnique.mockResolvedValue(undefined);

    await expect(
      useCase.execute(1, 10, { startAt: '2025-01-02T10:00:00.000Z' }),
    ).rejects.toMatchObject({
      message: 'Consulta não encontrada',
      statusCode: HttpStatusCode.NOT_FOUND,
    });
    expect(appointmentRepository.update).not.toHaveBeenCalled();
  });

  it('deve lançar 404 se o novo paciente não existir', async () => {
    const existing = makeAppointmentEntity({ id: 1, medicId: 10 });
    appointmentRepository.findUnique.mockResolvedValue(existing);
    patientRepository.findUnique.mockResolvedValue(undefined);

    await expect(
      useCase.execute(1, 10, { patientId: 999, startAt: existing.startAt.toISO() as string }),
    ).rejects.toMatchObject({
      message: 'Paciente não encontrado',
      statusCode: HttpStatusCode.NOT_FOUND,
    });
    expect(appointmentRepository.update).not.toHaveBeenCalled();
  });

  it('deve lançar erro para datas inválidas', async () => {
    const existing = makeAppointmentEntity({ id: 1, medicId: 10 });
    appointmentRepository.findUnique.mockResolvedValue(existing);

    await expect(
      useCase.execute(1, 10, { startAt: 'invalid', endAt: 'invalid' }),
    ).rejects.toMatchObject({
      message: 'Datas de agendamento inválidas',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });

  it('deve lançar erro quando endAt <= startAt', async () => {
    const existing = makeAppointmentEntity({ id: 1, medicId: 10 });
    appointmentRepository.findUnique.mockResolvedValue(existing);

    await expect(
      useCase.execute(1, 10, {
        startAt: existing.startAt.toISO() as string,
        endAt: existing.startAt.toISO() as string,
      }),
    ).rejects.toMatchObject({
      message: 'A data/hora de término deve ser maior que a de início',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });

  it('deve usar datas atuais quando payload não envia startAt e endAt', async () => {
    const existing = makeAppointmentEntity({ id: 1, medicId: 10 });
    appointmentRepository.findUnique.mockResolvedValue(existing);
    appointmentRepository.hasOverlap.mockResolvedValue(false);
    const updated = makeAppointmentEntity({ ...existing, status: existing.status });
    appointmentRepository.update.mockResolvedValue(updated);

    const result = await useCase.execute(1, 10, { status: existing.status });

    expect(appointmentRepository.hasOverlap).toHaveBeenCalledWith({
      medicId: 10,
      startAt: existing.startAt.toJSDate(),
      endAt: existing.endAt.toJSDate(),
      ignoreAppointmentId: 1,
    });
    expect(appointmentRepository.update).toHaveBeenCalledWith(1, 10, {
      status: existing.status,
      startAt: undefined,
      endAt: undefined,
    });
    expect(result).toEqual(updated);
  });

  it('deve validar quando apenas uma das datas é inválida', async () => {
    const existing = makeAppointmentEntity({ id: 1, medicId: 10 });
    appointmentRepository.findUnique.mockResolvedValue(existing);

    await expect(
      useCase.execute(1, 10, { startAt: 'data-invalida', endAt: existing.endAt.toISO() as string }),
    ).rejects.toMatchObject({
      message: 'Datas de agendamento inválidas',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });

  it('deve lançar conflito se houver overlap com outras consultas', async () => {
    const existing = makeAppointmentEntity({ id: 1, medicId: 10 });
    appointmentRepository.findUnique.mockResolvedValue(existing);
    appointmentRepository.hasOverlap.mockResolvedValue(true);

    await expect(
      useCase.execute(1, 10, {
        startAt: existing.startAt.plus({ hours: 1 }).toISO() as string,
        endAt: existing.endAt.plus({ hours: 2 }).toISO() as string,
      }),
    ).rejects.toMatchObject({
      message: 'Já existe consulta para este médico no intervalo informado',
      statusCode: HttpStatusCode.CONFLICT,
    });
  });
});
