import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: "User's full name",
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
    example: 'Mypassword$2024',
  })
  @IsString()
  password: string;
}
