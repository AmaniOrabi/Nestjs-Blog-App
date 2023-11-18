import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchBlogDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Title of the blog',
    example: 'My Blog',
    required: false,
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Author of the blog',
    example: 'John Doe',
    required: false,
  })
  author?: string;
}
