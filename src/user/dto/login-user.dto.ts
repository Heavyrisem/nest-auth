import { PickType } from '@nestjs/swagger';

import { User } from '../user.entity';

export class LoginUserDto extends PickType(User, ['email', 'password']) {}
