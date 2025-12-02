import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreateAppointmentRequestDTO } from '#usecases/appointment/create/create-appointment.dto';
import type { CreateAppointmentUseCasePort } from '#usecases/appointment/create/create-appointment.port';
import type { DeleteAppointmentUseCasePort } from '#usecases/appointment/delete/delete-appointment.port';
import type { GetAppointmentsRequestDTO } from '#usecases/appointment/get-all/get-appointments.dto';
import type { GetAppointmentsUseCasePort } from '#usecases/appointment/get-all/get-appointments.port';
import type { UpdateAppointmentRequestDTO } from '#usecases/appointment/update/update-appointment.dto';
import type { UpdateAppointmentUseCasePort } from '#usecases/appointment/update/update-appointment.port';
import type {
  CreateNoteRequestDTO,
  CreateNoteUseCaseRequestDTO,
} from '#usecases/note/create/create-note.dto';
import type { CreateNoteUseCasePort } from '#usecases/note/create/create-note.port';
import type { UpdateNoteRequestDTO } from '#usecases/note/update/update-note.dto';
import type { UpdateNoteUseCasePort } from '#usecases/note/update/update-note.port';
import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AppointmentController {
  constructor(
    @inject('CreateAppointmentUseCase')
    private readonly createAppointmentUseCase: CreateAppointmentUseCasePort,

    @inject('GetAppointmentsUseCase')
    private readonly getAppointmentsUseCase: GetAppointmentsUseCasePort,

    @inject('UpdateAppointmentUseCase')
    private readonly updateAppointmentUseCase: UpdateAppointmentUseCasePort,

    @inject('DeleteAppointmentUseCase')
    private readonly deleteAppointmentUseCase: DeleteAppointmentUseCasePort,

    @inject('CreateNoteUseCase')
    private readonly createNoteUseCase: CreateNoteUseCasePort,

    @inject('UpdateNoteUseCase')
    private readonly updateNoteUseCase: UpdateNoteUseCasePort,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const medicId = Number(req.user.sub);
    if (Number.isNaN(medicId)) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const body: CreateAppointmentRequestDTO = req.body;
    const appointment = await this.createAppointmentUseCase.execute(medicId, body);

    res.status(HttpStatusCode.CREATED).json(appointment);
  }

  async list(req: Request, res: Response): Promise<void> {
    const medicId = Number(req.user.sub);

    const query: GetAppointmentsRequestDTO = {
      includeDeleted: req.query.includeDeleted === 'true',
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
    };

    const appointments = await this.getAppointmentsUseCase.execute(medicId, query);
    res.status(HttpStatusCode.OK).json(appointments);
  }

  async update(req: Request, res: Response): Promise<void> {
    const medicId = Number(req.user.sub);
    const appointmentId = this.getAppointmentId(req, res);
    if (!appointmentId) return;

    const body: UpdateAppointmentRequestDTO = req.body;
    const appointment = await this.updateAppointmentUseCase.execute(appointmentId, medicId, body);

    res.status(HttpStatusCode.OK).json(appointment);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const medicId = Number(req.user.sub);
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Id inválido' });
      return;
    }

    await this.deleteAppointmentUseCase.execute(id, medicId);
    res.sendStatus(HttpStatusCode.NO_CONTENT);
  }

  async addNote(req: Request, res: Response): Promise<void> {
    const medicId = Number(req.user.sub);
    const appointmentId = this.getAppointmentId(req, res);
    if (!appointmentId) return;

    const dto: CreateNoteUseCaseRequestDTO = {
      ...(req.body as CreateNoteRequestDTO),
      appointmentId,
    };
    const note = await this.createNoteUseCase.execute(medicId, dto);

    res.status(HttpStatusCode.CREATED).json(note);
  }

  async updateNote(req: Request, res: Response): Promise<void> {
    const medicId = Number(req.user.sub);
    const appointmentId = this.getAppointmentId(req, res);
    if (!appointmentId) return;

    const body: UpdateNoteRequestDTO = req.body;
    const note = await this.updateNoteUseCase.execute(appointmentId, medicId, body);

    res.status(HttpStatusCode.OK).json(note);
  }

  private getAppointmentId(req: Request, res: Response): number | undefined {
    const appointmentId = Number(req.params.id);
    if (Number.isNaN(appointmentId)) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Id inválido' });
      return;
    }

    return appointmentId;
  }
}
