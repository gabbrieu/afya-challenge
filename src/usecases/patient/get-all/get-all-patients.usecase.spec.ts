import { makePatientEntity } from '#tests/mocks/entities';
import { patientRepositoryMock } from '#tests/mocks/repositories';
import { GetAllPatientsUseCase } from '#usecases/patient/get-all/get-all-patients.usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('GetAllPatientsUseCase', () => {
  const useCase = new GetAllPatientsUseCase(patientRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve listar pacientes com paginação', async () => {
    const payload = { page: 2, pageSize: 20, includeDeleted: true };
    const response = {
      data: [makePatientEntity({ id: 1 }), makePatientEntity({ id: 2 })],
      total: 2,
      page: 2,
      pageSize: 20,
    };
    patientRepositoryMock.getAll.mockResolvedValue(response);

    const result = await useCase.execute(payload);

    expect(patientRepositoryMock.getAll).toHaveBeenCalledWith(payload);
    expect(result).toStrictEqual(response);
  });

  it('deve propagar erro do repositório', async () => {
    const payload = { page: 1, pageSize: 10 };
    patientRepositoryMock.getAll.mockRejectedValue(new Error('db error'));

    await expect(useCase.execute(payload)).rejects.toThrow('db error');
  });
});
