import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Configs } from 'src/configuration';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService<Configs>,
  ) {}

  async signUp(userPayload: SignUpDto) {
    try {
      const usersExist = await this.userRepository.findOne({
        where: [
          { username: userPayload.username },
          { email: userPayload.email },
        ],
      });

      if (usersExist)
        throw new BadRequestException('Email or username already exist');

      const newUser = {
        ...userPayload,
      };

      newUser.password = await bcrypt.hash(newUser.password, 10);
      const user = this.userRepository.create(newUser);
      return await this.userRepository.save(user);
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

      const passwordIsMatch = await userExist.validatePassword(user.password);

      if (!passwordIsMatch)
        throw new UnauthorizedException('cinvalid credentials');
      const payload = { sub: userExist.id, username: userExist.username };
      const accessToken = await this.jwtService.signAsync(payload);

      return { access_token: accessToken };
    } catch (error) {
      throw new InternalServerErrorException('Unexpected error during sign-in');
    }
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const passwordIsMatch = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!passwordIsMatch) {
        throw new UnauthorizedException('Old password is incorrect');
      }
      user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
      await this.userRepository.save(user);
      return { message: 'Password changed successfully' };
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
