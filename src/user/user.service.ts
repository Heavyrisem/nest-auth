import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.entity';

import { JwtService } from '~src/modules/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({ email, password, name }: CreateUserDto): Promise<boolean> {
    const exists = await this.userRepository.findOne({ where: { email } });
    if (exists) throw new ConflictException('Account Already Exists');

    await this.userRepository.save(this.userRepository.create({ email, password, name }));
    return true;
  }

  async login({ email, password }: LoginUserDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User Not Found');
    if (!(await user.checkPassword(password))) throw new UnauthorizedException('Password is Wrong');

    const token = this.jwtService.sign({ id: user.id });
    return token;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User Not Found');

    return user;
  }
}
