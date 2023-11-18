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

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async getPublicBlogs(query: {
    title?: string;
    content?: string;
  }): Promise<Blog[]> {}

  async singleBlog(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOne(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async create(userId: number, createBlogDto: CreateBlogDto): Promise<Blog> {
    const user = await this.userService.findById(userId);
    const blog = this.blogRepository.create({ ...createBlogDto, user });
    return this.blogRepository.save(blog);
  }

  async update(
    userId: number,
    id: number,
    updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    // Implement logic to update a blog
    const blog = await this.blogRepository.findOne(id, { relations: ['user'] });
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
    // Implement logic to delete a blog
    const blog = await this.blogRepository.findOne(id, { relations: ['user'] });
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
