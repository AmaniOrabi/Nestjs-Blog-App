import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['blog', 'user'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Blog, (blog) => blog.likedBy)
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @ManyToOne(() => User, (user) => user.likedBlogs)
  @JoinColumn({ name: 'userId' })
  user: User;
}
