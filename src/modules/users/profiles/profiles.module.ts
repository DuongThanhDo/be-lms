import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './profiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService, TypeOrmModule],
})
export class ProfilesModule {}
