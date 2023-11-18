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
  ApiTags,
} from '@nestjs/swagger';
import { getUser } from 'src/shared/decorators/req-user.decorator';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Blogs')
@UseInterceptors(ResponseInterceptor)
@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @ApiOperation({
    summary: 'get public Blogs',
  })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'content', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async getPublicBlogs(@Query() query: searchBlogDto) {
    // Implement your logic using TypeORM to get public blogs
    return this.blogsService.getPublicBlogs(query);
  }

  @ApiOperation({ summary: 'get blog by Id' })
  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  async getBlog(@Param('id') id: string) {
    return this.blogsService.singleBlog(Number(id));
  }

  @ApiOperation({
    summary: 'create blog',
  })
  @ApiBearerAuth()
  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async createBlog(
    @getUser('id') userId: number,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return this.blogsService.create(userId, createBlogDto);
  }

  @ApiOperation({
    summary: 'update blog by Id',
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
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async deleteBlog(@getUser('id') userId: number, @Param('id') id: string) {
    return this.blogsService.delete(userId, Number(id));
  }
}
