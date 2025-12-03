import { makePatientEntity } from '#tests/mocks/entities';
import { patientRepositoryMock } from '#tests/mocks/repositories';
import type { CreatePatientRequestDTO } from '#usecases/patient/create/create-patient.dto';
import { CreatePatientUseCase } from '#usecases/patient/create/create-patient.usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CreatePatientUseCase', () => {
  const useCase = new CreatePatientUseCase(patientRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });
  const patient = makePatientEntity();

  it('deve criar um paciente com os dados informados', async () => {
    const payload: CreatePatientRequestDTO = {
      name: patient.name!,
      email: patient.email!,
      cellphone: patient.cellphone!,
      birthDate: patient.birthDate!.toISO()!,
      sex: patient.sex!,
      height: patient.height!,
      weight: patient.weight!,
    };
    const created = makePatientEntity({ ...payload, birthDate: patient.birthDate });
    patientRepositoryMock.create.mockResolvedValue(created);

    const result = await useCase.execute(payload);

    expect(patientRepositoryMock.create).toHaveBeenCalledWith(payload);
    expect(result).toStrictEqual(created);
  });

  it('deve propagar erro se o repositório falhar', async () => {
    const payload: CreatePatientRequestDTO = {
      name: patient.name!,
      email: patient.email!,
      cellphone: patient.cellphone!,
      birthDate: patient.birthDate!.toISO()!,
      sex: patient.sex!,
      height: patient.height!,
      weight: patient.weight!,
    };
    patientRepositoryMock.create.mockRejectedValue(new Error('db error'));

    await expect(useCase.execute(payload)).rejects.toThrow('db error');
  });
});
