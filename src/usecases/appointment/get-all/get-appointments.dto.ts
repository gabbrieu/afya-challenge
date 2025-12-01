import { BaseListQueryDTO } from '#usecases/base/list-query.dto';

export class GetAppointmentsRequestDTO extends BaseListQueryDTO {
  declare dateFrom?: string;
  declare dateTo?: string;
}
