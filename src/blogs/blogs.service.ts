// blog.service.ts
import {
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

@Injectable()
export class BlogsService {
  usersService: any;
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
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
    const blog = await this.blogRepository.findOne({ where: { id: id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async create(userId: number, createBlogDto: CreateBlogDto): Promise<Blog> {
    const user = await this.usersService.findById(userId);
    const blog = this.blogRepository.create({ ...createBlogDto, user });
    return this.blogRepository.save(blog);
  }

  async update(
    userId: number,
    id: number,
    updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    // Implement logic to update a blog
    const blog = await this.blogRepository.findOne({ where: { id: id } });
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
    blog.title = updateBlogDto.title ?? blog.title;
    blog.content = updateBlogDto.content ?? blog.content;

    return this.blogRepository.save(blog);
  }

  async delete(userId: number, id: number): Promise<void> {
    const blog = await this.blogRepository.findOne({ where: { id: id } });
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
}
