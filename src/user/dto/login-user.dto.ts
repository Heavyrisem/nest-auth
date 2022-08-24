import { IsString } from 'class-validator';

export class LoginUserDto {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @IsString()
  email: string;

  @IsString()
  password: string;
}
