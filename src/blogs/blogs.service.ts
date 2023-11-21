import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { SearchBlogDto } from './dto/search-blog.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly usersService: UsersService,
  ) {}

  async getAllBlogs(search: SearchBlogDto) {
    const query: any = {};

    if (search.title) {
      query.title = { contains: search.title };
    }

    if (search.author) {
      query.author = { contains: search.author };
    }

    try {
      const blogs: Blog[] = await this.blogRepository.find(query);

      return {
        blogs,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async getBlog(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async create(createBlogDto: CreateBlogDto, id?: string): Promise<Blog> {
    const parsedId = parseInt(id);
    if (!parsedId) {
      throw new NotFoundException('User not found');
    }
    const blog = this.blogRepository.create({
      ...createBlogDto,
      authorId: parsedId,
    });
    return this.blogRepository.save(blog);
  }

  async update(
    userId: number,
    id: number,
    updateBlogPayload: UpdateBlogDto,
  ): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Check if the user owns the blog
    if (blog.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this blog',
      );
    }

    // Update blog properties
    blog.title = updateBlogPayload.title ?? blog.title;
    blog.content = updateBlogPayload.content ?? blog.content;

    return this.blogRepository.save(blog);
  }

  async delete(userId: number, id: number): Promise<void> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Check if the user owns the blog
    if (blog.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this blog',
      );
    }

    await this.blogRepository.remove(blog);
  }

  async likeBlog(userId: number, blogId: number): Promise<Blog> {
    const user = await this.usersService.getUserById(userId);
    const blog = await this.getBlog(blogId);

    if (blog.authorId === userId) {
      throw new BadRequestException('You cannot like your own blog.');
    }

    blog.likedBy.push(user);

    await this.blogRepository.save(blog);
    return blog;
  }
}
