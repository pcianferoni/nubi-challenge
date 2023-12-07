import { SetMetadata } from '@nestjs/common';
import { REGISTERED_USER_KEY } from '../../constants/key-decorator';

export const RegisteredUser = () => SetMetadata(REGISTERED_USER_KEY, true);
