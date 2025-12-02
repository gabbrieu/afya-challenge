import type { AppointmentRepository } from '#repositories/appointment-repository.interface';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeAppointmentEntity } from '#tests/mocks/entities';
import type { MockedRepository } from '#tests/types';
import { DeleteAppointmentUseCase } from '#usecases/appointment/delete/delete-appointment.usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('DeleteAppointmentUseCase', () => {
  const appointmentRepository: MockedRepository<AppointmentRepository> = {
    hasOverlap: vi.fn(),
    create: vi.fn(),
    listByMedic: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const useCase = new DeleteAppointmentUseCase(appointmentRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve deletar uma consulta existente do médico', async () => {
    appointmentRepository.findUnique.mockResolvedValue(
      makeAppointmentEntity({ id: 1, medicId: 10 }),
    );
    appointmentRepository.delete.mockResolvedValue();

    await expect(useCase.execute(1, 10)).resolves.toBeUndefined();

    expect(appointmentRepository.findUnique).toHaveBeenCalledWith({ id: 1, medicId: 10 });
    expect(appointmentRepository.delete).toHaveBeenCalledWith(1);
  });

  it('deve lançar 404 quando a consulta não existe para o médico', async () => {
    appointmentRepository.findUnique.mockResolvedValue(undefined);

    await expect(useCase.execute(99, 10)).rejects.toMatchObject({
      message: 'Consulta não encontrada',
      statusCode: HttpStatusCode.NOT_FOUND,
    });
    expect(appointmentRepository.delete).not.toHaveBeenCalled();
  });
});
