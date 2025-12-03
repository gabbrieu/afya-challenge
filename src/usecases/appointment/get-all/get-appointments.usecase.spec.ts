import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeAppointmentEntity } from '#tests/mocks/entities';
import { appointmentRepositoryMock } from '#tests/mocks/repositories';
import { GetAppointmentsUseCase } from '#usecases/appointment/get-all/get-appointments.usecase';
import { DateTime } from 'luxon';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('GetAppointmentsUseCase', () => {
  const useCase = new GetAppointmentsUseCase(appointmentRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve listar consultas com filtros de data válidos', async () => {
    const medicId = 1;
    const dateFrom = '2025-01-02T10:00:00.000Z';
    const dateTo = '2025-01-05T10:00:00.000Z';
    const response = {
      data: [makeAppointmentEntity({ medicId })],
      total: 1,
      page: 1,
      pageSize: 10,
    };

    appointmentRepositoryMock.listByMedic.mockResolvedValue(response);

    const result = await useCase.execute(medicId, { dateFrom, dateTo, page: 1, pageSize: 10 });

    expect(appointmentRepositoryMock.listByMedic).toHaveBeenCalledWith(medicId, {
      dateFrom: DateTime.fromISO(dateFrom).toISO(),
      dateTo: DateTime.fromISO(dateTo).toISO(),
      page: 1,
      pageSize: 10,
    });
    expect(result).toStrictEqual(response);
  });

  it('deve lançar 400 quando dateFrom for inválida', async () => {
    const medicId = 1;
    const invalidPayload = { dateFrom: 'invalid-date' };

    await expect(useCase.execute(medicId, invalidPayload)).rejects.toMatchObject({
      message: 'Datas dos filtros inválidas',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });

    expect(appointmentRepositoryMock.listByMedic).not.toHaveBeenCalled();
  });

  it('deve lançar 400 quando dateTo for inválida', async () => {
    const medicId = 1;
    const invalidPayload = { dateTo: 'invalid-date' };

    await expect(useCase.execute(medicId, invalidPayload)).rejects.toMatchObject({
      message: 'Datas dos filtros inválidas',
      statusCode: HttpStatusCode.BAD_REQUEST,
    });

    expect(appointmentRepositoryMock.listByMedic).not.toHaveBeenCalled();
  });
});
