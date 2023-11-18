import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { getUser } from 'src/shared/decorators/req-user.decorator';
import CheckRoleGuard from 'src/shared/guards/check-roles.guard';
import { ResponseInterceptor } from '../../shared/interceptors/response.interceptor';
import { authGuard } from '../../shared/guards/auth.guard';

@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
@UseGuards(authGuard(false))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'get profile',
  })
  @ApiTags('Current User')
  @Get('/@me')
  profile(@getUser<User>() user: User) {
    return this.usersService.getProfile(user);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiTags('All Users')
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiTags('Current User')
  @Put(':id')
  updateUser(
    @Param() getUserDto: GetUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return this.usersService.updateUser(getUserDto.id, updateUserDto);
  }
}
