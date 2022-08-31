import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.entity';
import { UserRole } from './userRole.entity';
import { CreateRoleDto } from './dto/create-role.dto';

import { JwtService } from '~src/modules/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>,
    private readonly jwtService: JwtService,
  ) {}

  async createRole({ name, description }: CreateRoleDto): Promise<boolean> {
    const exists = await this.userRoleRepository.findOne({ where: { name } });
    if (exists) throw new ConflictException('Role Already Exists');

    await this.userRoleRepository.save(this.userRoleRepository.create({ name, description }));
    return true;
  }

  async createUser(
    { email, password, name }: CreateUserDto,
    roles = ['default'],
  ): Promise<boolean> {
    const exists = await this.userRepository.findOne({ where: { email } });
    if (exists) throw new ConflictException('Account Already Exists');

    const role = await this.userRoleRepository.find({
      where: roles.map((roleName) => ({ name: roleName })),
    });

    const temp = this.userRepository.create({ email, password, name, role });
    await this.userRepository.save(temp);
    return true;
  }

  async login({ email, password }: LoginUserDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email }, relations: { role: true } });
    if (!user) throw new NotFoundException('User Not Found');
    if (!(await user.checkPassword(password))) throw new UnauthorizedException('Password is Wrong');

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.map((r) => ({ name: r.name, description: r.description })),
    });
    return token;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User Not Found');

    return user;
  }
}
