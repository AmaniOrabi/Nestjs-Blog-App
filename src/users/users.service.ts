import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmailOrUsername(
    username?: string,
    email?: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async updateUser(id: number, updatedUser: Partial<User>): Promise<User> {
    await this.getUserById(id);
    await this.userRepository.update(id, updatedUser);
    return this.getUserById(id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.getUserById(id);
    await this.userRepository.delete(id);
  }
}
