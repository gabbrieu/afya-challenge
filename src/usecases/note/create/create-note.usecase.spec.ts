import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeAppointmentEntity, makeNoteEntity } from '#tests/mocks/entities';
import { appointmentRepositoryMock, noteRepositoryMock } from '#tests/mocks/repositories';
import { CreateNoteUseCase } from '#usecases/note/create/create-note.usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CreateNoteUseCase', () => {
  const useCase = new CreateNoteUseCase(noteRepositoryMock, appointmentRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve criar uma nota quando a consulta existe para o médico', async () => {
    const medicId = 10;
    const appointment = makeAppointmentEntity({ id: 1, medicId });
    appointmentRepositoryMock.findUnique.mockResolvedValue(appointment);
    const payload = { appointmentId: appointment.id, content: 'Nova nota' };
    const createdNote = makeNoteEntity({ appointmentId: appointment.id, medicId });
    noteRepositoryMock.create.mockResolvedValue(createdNote);

    const result = await useCase.execute(medicId, payload);

    expect(appointmentRepositoryMock.findUnique).toHaveBeenCalledWith({
      id: appointment.id,
      medicId,
    });
    expect(noteRepositoryMock.create).toHaveBeenCalledWith(medicId, payload);
    expect(result).toStrictEqual(createdNote);
  });

  it('deve lançar 404 quando a consulta não existe para o médico', async () => {
    const medicId = 10;
    appointmentRepositoryMock.findUnique.mockResolvedValue(undefined);

    const response = useCase.execute(medicId, { appointmentId: 123, content: 'Nota' });

    await expect(response).rejects.toMatchObject({
      message: 'Consulta não encontrada',
      statusCode: HttpStatusCode.NOT_FOUND,
    });
    expect(noteRepositoryMock.create).not.toHaveBeenCalled();
  });
});
