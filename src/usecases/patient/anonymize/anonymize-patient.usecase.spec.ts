import { HttpStatusCode } from '#shared/http-status-code.enum';
import { patientRepositoryMock } from '#tests/mocks/repositories';
import { AnonymizePatientUseCase } from '#usecases/patient/anonymize/anonymize-patient.usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('AnonymizePatientUseCase', () => {
  const useCase = new AnonymizePatientUseCase(patientRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve anonimizar um paciente existente', async () => {
    const patientId = 1;
    const anonymized = { id: patientId, anonymized: true };
    patientRepositoryMock.findUnique.mockResolvedValue({ id: patientId });
    patientRepositoryMock.anonymize.mockResolvedValue(anonymized);

    const result = await useCase.execute(patientId);

    expect(patientRepositoryMock.findUnique).toHaveBeenCalledWith({ id: patientId });
    expect(patientRepositoryMock.anonymize).toHaveBeenCalledWith(patientId);
    expect(result).toStrictEqual(anonymized);
  });

  it('deve lançar 404 quando o paciente não existe', async () => {
    patientRepositoryMock.findUnique.mockResolvedValue(undefined);

    const response = useCase.execute(999);

    await expect(response).rejects.toMatchObject({
      message: 'Paciente não encontrado',
      statusCode: HttpStatusCode.NOT_FOUND,
    });
    expect(patientRepositoryMock.anonymize).not.toHaveBeenCalled();
  });
});
