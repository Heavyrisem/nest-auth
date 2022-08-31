import { IsString } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

import { UserRole } from './userRole.entity';

import { CoreEntity } from '~src/modules/database/core.entity';

@Entity()
export class User extends CoreEntity {
  @IsString()
  @Column()
  email: string;

  @IsString()
  @Column()
  name: string;

  @Exclude({ toPlainOnly: true })
  @IsString()
  @Column()
  password: string;

  @ManyToMany(() => UserRole, (userRole) => userRole.id)
  @JoinTable({ name: 'user_role_join' })
  role: UserRole[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async checkPassword(inputPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, this.password);
  }
}
