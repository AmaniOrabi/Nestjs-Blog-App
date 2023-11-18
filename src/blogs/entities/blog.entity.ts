import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  //   ManyToOne,
  //   JoinColumn,
} from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 350 })
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  cover: string;

  //   @ManyToOne(() => User)
  //   @JoinColumn({ name: 'authorId' })
  //   author: User;

  @Column()
  authorId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
