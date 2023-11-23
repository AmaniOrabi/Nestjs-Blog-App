import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { User } from './entities/user.entity';
import { CurrentUserParam } from 'src/auth/params/currentUserParam';

@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get current user',
  })
  @ApiTags('Current User')
  @Get('')
  getCurrentUser(@CurrentUserParam() user: User) {
    return this.usersService.getUserById(user.id);
  }

  @ApiOperation({ summary: 'get user by Id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Blog retrieved successfully',
  })
  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    delete user.password;
    return user;
  }
}
