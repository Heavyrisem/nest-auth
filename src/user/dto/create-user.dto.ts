import { IsString } from 'class-validator';

export class CreateUserDto {
  constructor(email: string, name: string, password: string) {
    this.email = email;
    this.name = name;
    this.password = password;
  }

  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}
