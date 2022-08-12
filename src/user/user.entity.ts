import { IsString } from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CoreEntity } from '~src/modules/database/core.entity';

@Entity()
export class User extends CoreEntity {
  @IsString()
  @Column()
  email: string;

  @IsString()
  @Column()
  name: string;

  @IsString()
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async checkPassword(inputPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, this.password);
  }
}
