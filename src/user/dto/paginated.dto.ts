import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<TData> {
  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  recordsPerPage: number;

  @ApiProperty()
  totalRecords: number;

  @ApiProperty({
    type: () => ({}) as TData,
  })
  records: TData[];
}
