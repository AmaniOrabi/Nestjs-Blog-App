import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'The username of the user',
    required: true,
    type: String,
    example: 'John Doe',
    uniqueItems: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    required: true,
    type: String,
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    required: true,
    type: String,
    example: 'password$2024',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
