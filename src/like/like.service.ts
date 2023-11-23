import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { User } from 'src/users/entities/user.entity';
import { Blog } from 'src/blogs/entities/blog.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async toggleLike(blog: Blog, user: User): Promise<void> {
    const hasLiked = await this.likeRepository.findOne({
      where: {
        blog: { id: blog.id },
        user: { id: user.id },
      },
    });
    if (hasLiked) {
      await this.likeRepository.delete({
        blog: { id: blog.id },
        user: { id: user.id },
      });
    } else {
      const like = new Like();
      like.blog = blog;
      like.user = user;

      this.likeRepository.save(like);
    }
  }
  async getUserLikesBlog(blogId: string, userId: string): Promise<boolean> {
    const hasLiked = await this.likeRepository.findOne({
      where: {
        blog: { id: blogId },
        user: { id: userId },
      },
    });
    return !!hasLiked;
  }
  async getBlogLikeCount(blogId: string): Promise<number> {
    const blogs = await this.likeRepository.find({
      where: {
        blog: { id: blogId },
      },
    });
    return blogs.length;
  }

  async deleteLikesByBlogId(blogId: string): Promise<void> {
    try {
      const likes = await this.likeRepository.find({
        where: {
          blog: { id: blogId },
        },
      });

      await Promise.all(
        likes.map(async (like) => this.likeRepository.remove(like)),
      );
    } catch (error) {
      throw new NotFoundException('Likes not found');
    }
  }
}
