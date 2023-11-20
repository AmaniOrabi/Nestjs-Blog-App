import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { authGuard } from 'src/shared/guards/auth.guard';
import { getUser } from 'src/shared/decorators/req-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ChangePasswordDto } from './dto/changePassword.dto';

@ApiTags('Auth')
@UseInterceptors(ResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'signup',
  })
  @Post('signup')
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async signup(@Body() body: SignUpDto): Promise<void> {
    await this.authService.signUp(body);
  }

  @ApiOperation({
    summary: 'signing',
  })
  @Post('signing')
  @HttpCode(200)
  async signing(@Body() body: SignInDto): Promise<Object> {
    return await this.authService.signIn(body);
  }

  @ApiOperation({
    summary: 'change password',
  })
  @Post('change-password')
  @UseGuards(authGuard(true))
  @HttpCode(200)
  async changePassword(
    @getUser<User>() user: User,
    @Body() body: ChangePasswordDto,
  ): Promise<Object> {
    return await this.authService.changePassword(user.id, body);
  }
}
