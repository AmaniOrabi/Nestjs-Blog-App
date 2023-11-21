import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { getUser } from 'src/shared/decorators/req-user.decorator';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { BlogsService } from './blogs.service';
import { SearchBlogDto } from './dto/search-blog.dto';
import { User } from 'src/users/entities/user.entity';
import { CanLikeBlogGuard } from 'src/shared/guards/canLikeBlog.guard';

@ApiTags('Blogs')
@UseInterceptors(ResponseInterceptor)
@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @ApiOperation({
    summary: 'get all Blogs',
  })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'author', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of blogs retrieved successfully',
  })
  @Get()
  async getAllBlogs(@Query() query: SearchBlogDto) {
    return this.blogsService.getAllBlogs(query);
  }

  @ApiOperation({ summary: 'get blog by Id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Blog retrieved successfully',
  })
  @Get('/:id')
  async getBlog(@Param('id') id: string) {
    return this.blogsService.getBlog(Number(id));
  }

  @ApiOperation({
    summary: 'create blog',
  })
  @ApiResponse({
    status: 201,
    description: 'Blog created successfully',
  })
  @ApiBearerAuth()
  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @ApiOperation({
    summary: 'update blog by Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Blog updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Blog not found',
  })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateBlog(
    @getUser('id') userId: number,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(userId, Number(id), updateBlogDto);
  }

  @ApiOperation({
    summary: 'delete blog by Id',
  })
  @ApiResponse({
    status: 204,
    description: 'Blog deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Blog not found',
  })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async deleteBlog(@getUser('id') userId: number, @Param('id') id: string) {
    return this.blogsService.delete(userId, Number(id));
  }

  @ApiOperation({ summary: 'Like a blog' })
  @ApiResponse({ status: 200, description: 'Blog liked successfully.' })
  @Post(':id/like')
  @UseGuards(CanLikeBlogGuard)
  async likeBlog(@getUser<User>() user: User, @Param('id') blogId: number) {
    await this.blogsService.likeBlog(user.id, blogId);
    return { message: 'Blog liked successfully.' };
  }
}
