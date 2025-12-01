export interface DeleteAppointmentUseCasePort {
  execute(id: number, medicId: number): Promise<void>;
}
