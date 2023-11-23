import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { UsersService } from 'src/users/users.service';
import { LikeService } from 'src/like/like.service';

@Injectable()
export class BlogsService {
  blogService: BlogsService;
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly usersService: UsersService,
    private readonly likeService: LikeService,
  ) {}

  async getAllBlogs(userId: string) {
    try {
      const blogs: Blog[] = await this.blogRepository.find({
        where: {
          authorId: Not(userId),
        },
      });

      return {
        blogs: await Promise.all(
          blogs.map(async (blog) => {
            const likedByUser = await this.likeService.getUserLikesBlog(
              blog.id,
              userId,
            );
            const likeCount = await this.likeService.getBlogLikeCount(blog.id);

            return {
              ...blog,
              likedByUser,
              likeCount,
            };
          }),
        ),
      };
    } catch (error: any) {
      throw error;
    }
  }

  async getBlogById(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async getDetailedBlogById(id: string, userId: string) {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    const likedByUser = await this.likeService.getUserLikesBlog(id, userId);
    const likeCount = await this.likeService.getBlogLikeCount(id);

    return {
      ...blog,
      likedByUser,
      likeCount,
    };
  }

  async create(createBlogDto: CreateBlogDto, id?: string): Promise<Blog> {
    if (!id) {
      throw new NotFoundException('User not found');
    }
    const blog = this.blogRepository.create({
      ...createBlogDto,
      authorId: id,
    });
    return this.blogRepository.save(blog);
  }

  async update(id: string, updateBlogPayload: UpdateBlogDto): Promise<Blog> {
    const blog = await this.getBlogById(id);

    // Update blog properties
    blog.title = updateBlogPayload.title ?? blog.title;
    blog.content = updateBlogPayload.content ?? blog.content;

    return this.blogRepository.save(blog);
  }

  async delete(id: string): Promise<void> {
    const blog = await this.blogService.getBlogById(id);

    await this.blogRepository.remove(blog);
  }

  async toggleLikeBlog(userId: string, blogId: string): Promise<void> {
    const blog = await this.getBlogById(blogId);
    const user = await this.usersService.getUserById(userId);
    await this.likeService.toggleLike(blog, user);
  }

  async ownsBlog(userId: string, blogId: string): Promise<boolean> {
    const blog = await this.getBlogById(blogId);
    return !blog || blog.authorId === userId;
  }

  async canLikeBlog(userId: string, blogId: string): Promise<boolean> {
    const blog = await this.getBlogById(blogId);
    return !blog || blog.authorId !== userId;
  }
}
