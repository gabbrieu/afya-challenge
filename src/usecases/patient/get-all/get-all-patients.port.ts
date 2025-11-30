import type { GetAllPatientsRequestDTO } from '#usecases/patient/get-all/get-all-patients.dto';
import type { GetAllPatientsResponseDTO } from '#usecases/patient/get-all/get-all-patients.response';

export interface GetAllPatientsUseCasePort {
  execute(payload: GetAllPatientsRequestDTO): Promise<GetAllPatientsResponseDTO>;
}
