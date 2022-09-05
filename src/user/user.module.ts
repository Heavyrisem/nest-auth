import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRole } from './userRole.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>,
    private readonly userService: UserService,
  ) {}

  async onApplicationBootstrap() {
    const findDefaultRole = await this.userRoleRepository.findOne({ where: { name: 'default' } });
    if (findDefaultRole) return console.log('✔ Skipping Initialize User Data');

    console.log('♺ User Data Initalizing');

    const defaultRole = new UserRole();
    defaultRole.name = 'default';
    defaultRole.description = '기본 권한';
    await this.userRoleRepository.save(defaultRole);

    const adminRole = new UserRole();
    adminRole.name = 'admin';
    adminRole.description = '어드민';
    await this.userRoleRepository.save(adminRole);

    await this.userService.createUser({ email: 'test@gmail.com', name: 'test', password: 'asdf' }, [
      defaultRole.name,
      adminRole.name,
    ]);

    console.log('✔ User Data Initalized');
  }
}
