import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@ApiTags('Auth')
@UseInterceptors(ResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'signup',
  })
  @Post('signup')
  async signup(@Body() body: SignUpDto): Promise<Object> {
    return await this.authService.signUp(body);
  }

  @ApiOperation({
    summary: 'signing',
  })
  @Post('signing')
  @HttpCode(200)
  async signing(@Body() body: SignInDto): Promise<Object> {
    return await this.authService.signIn(body);
  }
}
