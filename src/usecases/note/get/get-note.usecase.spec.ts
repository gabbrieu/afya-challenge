import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeNoteEntity } from '#tests/mocks/entities';
import { noteRepositoryMock } from '#tests/mocks/repositories';
import { GetNoteUseCase } from '#usecases/note/get/get-note.usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('GetNoteUseCase', () => {
  const useCase = new GetNoteUseCase(noteRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar uma nota existente para a consulta do médico', async () => {
    const medicId = 10;
    const appointmentId = 1;
    const note = makeNoteEntity({ appointmentId, medicId });
    noteRepositoryMock.findUnique.mockResolvedValue(note);

    const result = await useCase.execute(appointmentId, medicId);

    expect(noteRepositoryMock.findUnique).toHaveBeenCalledWith({ appointmentId, medicId });
    expect(result).toStrictEqual(note);
  });

  it('deve lançar 404 quando a nota não existe', async () => {
    noteRepositoryMock.findUnique.mockResolvedValue(undefined);

    const response = useCase.execute(1, 10);

    await expect(response).rejects.toMatchObject({
      message: 'Nota não encontrada',
      statusCode: HttpStatusCode.NOT_FOUND,
    });
  });
});
