import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { BlogsService } from './blogs.service';
import { User } from 'src/users/entities/user.entity';
import { CurrentUserParam } from 'src/auth/params/currentUserParam';
import { BlogOwnerGuard } from './guards/blogOwner.guard';

@ApiTags('Blogs')
@UseInterceptors(ResponseInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @ApiOperation({
    summary: 'get all Blogs',
  })
  @ApiResponse({
    status: 200,
    description: 'List of blogs retrieved successfully',
  })
  @Get()
  async getAllBlogs(@CurrentUserParam() user) {
    return this.blogsService.getAllBlogs(user.id);
  }

  @ApiOperation({
    summary: 'get my Blogs',
  })
  @ApiResponse({
    status: 200,
    description: 'List of blogs retrieved successfully',
  })
  @Get('/my-blogs')
  async getMyBlogs(@CurrentUserParam() user) {
    return this.blogsService.getMyBlogs(user.id);
  }

  @ApiOperation({ summary: 'get blog by Id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Blog retrieved successfully',
  })
  @Get('/:id')
  async getBlog(@Param('id') id: string, @CurrentUserParam() user) {
    return this.blogsService.getDetailedBlogById(id, user.id);
  }

  @ApiOperation({
    summary: 'create blog',
  })
  @ApiResponse({
    status: 201,
    description: 'Blog created successfully',
  })
  @Post('/')
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @CurrentUserParam() user,
  ) {
    return this.blogsService.create(createBlogDto, user?.id);
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
  @Patch('/:id')
  // @UseGuards(BlogOwnerGuard)
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(id, updateBlogDto);
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
  @Delete('/:id')
  @UseGuards(BlogOwnerGuard)
  async deleteBlog(@Param('id') id: string) {
    return this.blogsService.delete(id);
  }

  @ApiOperation({ summary: 'Like a blog' })
  @ApiResponse({ status: 200, description: 'Blog liked successfully.' })
  @Post('/like/:id')
  async likeBlog(@CurrentUserParam() user: User, @Param('id') blogId: string) {
    await this.blogsService.toggleLikeBlog(user.id, blogId);
    return { message: 'Blog liked successfully.' };
  }
}
