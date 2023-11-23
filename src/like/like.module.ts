import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { Like } from './entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
