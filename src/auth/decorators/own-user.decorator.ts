import { SetMetadata } from '@nestjs/common';
import { OWN_USER_KEY } from '../../constants/key-decorator';

export const OwnUserAccess = () => SetMetadata(OWN_USER_KEY, true);
