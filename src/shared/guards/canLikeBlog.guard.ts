// blogs.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BlogsService } from 'src/blogs/blogs.service';

@Injectable()
export class CanLikeBlogGuard implements CanActivate {
  constructor(private blogsService: BlogsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user) {
      return false;
    }

    const blogId = +request.params.id;
    const blogAuthor = (await this.blogsService.getBlog(blogId)).authorId;

    return user.id !== blogAuthor;
  }
}
