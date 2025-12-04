import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makePatientEntity } from '#tests/mocks/entities';
import { patientRepositoryMock } from '#tests/mocks/repositories';
import { UpdatePatientUseCase } from '#usecases/patient/update/update-patient.usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('UpdatePatientUseCase', () => {
  const useCase = new UpdatePatientUseCase(patientRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve atualizar um paciente existente', async () => {
    const patientId = 1;
    const existing = makePatientEntity({ id: patientId });
    patientRepositoryMock.findUnique.mockResolvedValue(existing);
    const payload = { name: 'Novo Nome', weight: 100 };
    const updated = makePatientEntity({ ...existing, ...payload });
    patientRepositoryMock.update.mockResolvedValue(updated);

    const result = await useCase.execute(patientId, payload);

    expect(patientRepositoryMock.findUnique).toHaveBeenCalledWith({ id: patientId });
    expect(patientRepositoryMock.update).toHaveBeenCalledWith(patientId, payload);
    expect(result).toStrictEqual(updated);
  });

  it('deve lançar 404 quando o paciente não existe', async () => {
    patientRepositoryMock.findUnique.mockResolvedValue(undefined);

    const response = useCase.execute(999, { name: 'Paciente inexistente' });

    await expect(response).rejects.toMatchObject({
      message: 'Paciente não encontrado',
      statusCode: HttpStatusCode.NOT_FOUND,
    });
    expect(patientRepositoryMock.update).not.toHaveBeenCalled();
  });
});
