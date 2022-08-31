import { Column, Entity } from 'typeorm';

import { CoreEntity } from '~src/modules/database/core.entity';

@Entity()
export class UserRole extends CoreEntity {
  @Column()
  name: string;

  @Column()
  description: string;
}
