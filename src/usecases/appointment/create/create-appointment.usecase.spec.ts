import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeAppointmentEntity, makePatientEntity } from '#tests/mocks/entities';
import { appointmentRepositoryMock, patientRepositoryMock } from '#tests/mocks/repositories';
import { CreateAppointmentUseCase } from '#usecases/appointment/create/create-appointment.usecase';
import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('CreateAppointmentUseCase', () => {
  const medicId = 10;
  const useCase = new CreateAppointmentUseCase(appointmentRepositoryMock, patientRepositoryMock);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T10:00:00.000Z'));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve criar uma consulta quando dados são válidos e não há conflito', async () => {
    patientRepositoryMock.findUnique.mockResolvedValue(makePatientEntity());
    appointmentRepositoryMock.hasOverlap.mockResolvedValue(false);

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
    appointmentRepositoryMock.create.mockResolvedValue(created);

    const response = await useCase.execute(medicId, payload);

    expect(appointmentRepositoryMock.hasOverlap).toHaveBeenCalledWith({
      medicId,
      startAt: new Date(payload.startAt),
      endAt: new Date(payload.endAt),
    });
    expect(appointmentRepositoryMock.create).toHaveBeenCalledWith(medicId, payload);
    expect(response).toStrictEqual(created);
  });

  it('deve lançar 404 quando o paciente não existe', async () => {
    patientRepositoryMock.findUnique.mockResolvedValue(undefined);

    const payload = {
      patientId: 99,
      startAt: '2025-01-02T10:00:00.000Z',
      endAt: '2025-01-02T11:00:00.000Z',
    };

    const response = useCase.execute(medicId, payload);

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: 'Paciente não encontrado',
      statusCode: HttpStatusCode.NOT_FOUND,
    });
  });

  it('deve validar datas ISO', async () => {
    patientRepositoryMock.findUnique.mockResolvedValue(makePatientEntity());

    const payload = { patientId: 1, startAt: 'invalid', endAt: 'invalid' };
    const response = useCase.execute(medicId, payload);

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: 'Datas de agendamento inválidas',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });

  it('deve exigir endAt maior que startAt', async () => {
    patientRepositoryMock.findUnique.mockResolvedValue(makePatientEntity());

    const payload = {
      patientId: 1,
      startAt: '2025-01-02T10:00:00.000Z',
      endAt: '2025-01-02T09:00:00.000Z',
    };
    const response = useCase.execute(medicId, payload);

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: 'A data/hora de término deve ser maior que a de início',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });

  it('não deve permitir agendamento no passado', async () => {
    patientRepositoryMock.findUnique.mockResolvedValue(makePatientEntity());

    const payload = {
      patientId: 1,
      startAt: '2023-12-31T10:00:00.000Z',
      endAt: '2023-12-31T11:00:00.000Z',
    };
    const response = useCase.execute(medicId, payload);

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: 'Não dá para agendar consultas no passado',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });

  it('deve falhar quando já existe consulta no intervalo', async () => {
    patientRepositoryMock.findUnique.mockResolvedValue(makePatientEntity());
    appointmentRepositoryMock.hasOverlap.mockResolvedValue(true);

    const payload = {
      patientId: 1,
      startAt: '2025-01-02T10:00:00.000Z',
      endAt: '2025-01-02T11:00:00.000Z',
    };
    const response = useCase.execute(medicId, payload);

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(useCase.execute(medicId, payload)).rejects.toMatchObject({
      message: 'Já existe consulta para este médico no intervalo informado',
      statusCode: HttpStatusCode.CONFLICT,
    });
  });
});
