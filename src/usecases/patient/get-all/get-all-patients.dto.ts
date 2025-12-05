import { BaseListQueryDTO } from '#usecases/base/list-query.dto';

export class GetAllPatientsRequestDTO extends BaseListQueryDTO {
  declare includeDeleted?: boolean;
}
