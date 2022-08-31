import { IsString } from 'class-validator';

export class CreateRoleDto {
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  @IsString()
  name: string;

  @IsString()
  description: string;
}
