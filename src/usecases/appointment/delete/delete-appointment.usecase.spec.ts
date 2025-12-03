import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeAppointmentEntity } from '#tests/mocks/entities';
import { appointmentRepositoryMock } from '#tests/mocks/repositories';
import { DeleteAppointmentUseCase } from '#usecases/appointment/delete/delete-appointment.usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('DeleteAppointmentUseCase', () => {
  const useCase = new DeleteAppointmentUseCase(appointmentRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve deletar uma consulta existente do médico', async () => {
    appointmentRepositoryMock.findUnique.mockResolvedValue(
      makeAppointmentEntity({ id: 1, medicId: 10 }),
    );
    appointmentRepositoryMock.delete.mockResolvedValue(undefined);

    await expect(useCase.execute(1, 10)).resolves.toBeUndefined();

    expect(appointmentRepositoryMock.findUnique).toHaveBeenCalledWith({ id: 1, medicId: 10 });
    expect(appointmentRepositoryMock.delete).toHaveBeenCalledWith(1);
  });

  it('deve lançar 404 quando a consulta não existe para o médico', async () => {
    appointmentRepositoryMock.findUnique.mockResolvedValue(undefined);

    await expect(useCase.execute(99, 10)).rejects.toMatchObject({
      message: 'Consulta não encontrada',
      statusCode: HttpStatusCode.NOT_FOUND,
    });
    expect(appointmentRepositoryMock.delete).not.toHaveBeenCalled();
  });
});
