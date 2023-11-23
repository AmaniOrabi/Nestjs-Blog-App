import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 350 })
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  cover: string;

  @Column()
  authorId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToMany(() => User, (user) => user.likedBlogs)
  @JoinTable()
  likedBy: User[];
}
