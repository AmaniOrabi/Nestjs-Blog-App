import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { getUser } from 'src/shared/decorators/req-user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { User } from './entities/user.entity';

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
  @Get('/@me')
  getCurrentUser(@getUser<User>() user: User) {
    return this.usersService.getUserById(user.id);
  }
}
