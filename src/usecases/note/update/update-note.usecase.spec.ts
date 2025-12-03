import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeNoteEntity } from '#tests/mocks/entities';
import { noteRepositoryMock } from '#tests/mocks/repositories';
import { UpdateNoteUseCase } from '#usecases/note/update/update-note.usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('UpdateNoteUseCase', () => {
  const useCase = new UpdateNoteUseCase(noteRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve atualizar a nota quando ela existe para o médico', async () => {
    const medicId = 10;
    const appointmentId = 1;
    const existing = makeNoteEntity({ appointmentId, medicId, content: 'Antiga' });
    noteRepositoryMock.findUnique.mockResolvedValue(existing);
    const payload = { content: 'Nova nota' };
    const updated = makeNoteEntity({ ...existing, content: payload.content });
    noteRepositoryMock.update.mockResolvedValue(updated);

    const result = await useCase.execute(appointmentId, medicId, payload);

    expect(noteRepositoryMock.findUnique).toHaveBeenCalledWith({ appointmentId, medicId });
    expect(noteRepositoryMock.update).toHaveBeenCalledWith(appointmentId, medicId, payload);
    expect(result).toStrictEqual(updated);
  });

  it('deve lançar 404 quando a nota não existe', async () => {
    noteRepositoryMock.findUnique.mockResolvedValue(undefined);

    const response = useCase.execute(1, 10, { content: 'Atualização' });

    await expect(response).rejects.toMatchObject({
      message: 'Nota não encontrada',
      statusCode: HttpStatusCode.NOT_FOUND,
    });
    expect(noteRepositoryMock.update).not.toHaveBeenCalled();
  });
});
