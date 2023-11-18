import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the blog',
    example: 'My Blog',
    required: true,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Content of the blog',
    example: 'This is my blog',
    required: true,
  })
  content: string;

  @ApiProperty({
    description: 'Cover image of the blog',
    example:
      'https://www.greenunivers.com/wp-content/uploads/2021/07/neovee.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  cover: string;

  @ApiProperty({
    description: 'ID of the author who created the blog',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @ApiProperty({
    description: 'Timestamp when the blog was created',
    required: true,
  })
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the blog was last updated',
    required: true,
  })
  @IsNotEmpty()
  updatedAt: Date;
}
