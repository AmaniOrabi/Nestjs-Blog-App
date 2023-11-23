import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BlogsService } from '../blogs.service';

export const PanelOwnerAuthStrategyName = 'PanelOwnerAuthStrategy';

@Injectable()
export class BlogOwnerGuard implements CanActivate {
  constructor(private blogsService: BlogsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;
    const { id: userId } = user;
    const { id: blogId } = params;

    return await this.blogsService.ownsBlog(userId, blogId);
  }
}
