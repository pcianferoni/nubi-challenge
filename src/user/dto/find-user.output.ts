import { User } from 'src/shared/dto/user.dto';
import { PaginatedDto } from './paginated.dto';

export class FindUserOutput extends PaginatedDto<User> {}
