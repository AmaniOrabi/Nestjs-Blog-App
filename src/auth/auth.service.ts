import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Configs } from 'src/configuration';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService<Configs>,
  ) {}

  async signUp(userDto: SignUpDto) {
    try {
      const usersExist = await this.userRepository.findOne({
        where: [{ username: userDto.username }, { email: userDto.email }],
      });

      if (usersExist)
        throw new BadRequestException('Email or username already exist');

      const newUser = {
        ...userDto,
      };

      newUser.password = await bcrypt.hash(newUser.password, 10);

      const user = await this.userRepository.create(newUser);

      return this.jwtSignUserId(user.id);
    } catch (error) {
      throw error;
    }
  }

  async signIn(user: SignInDto) {
    try {
      const userExist = await this.userRepository.findOne({
        where: { username: user.username },
      });
      if (!userExist) throw new UnauthorizedException('invalid credentials');

      const passwordIsMatch = await bcrypt.compare(
        user.password,
        userExist.password,
      );
      if (!passwordIsMatch)
        throw new UnauthorizedException('invalid credentials');

      return this.jwtSignUserId(userExist.id);
    } catch (error) {
      throw error;
    }
  }

  private jwtSignUserId(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );
  }
}
