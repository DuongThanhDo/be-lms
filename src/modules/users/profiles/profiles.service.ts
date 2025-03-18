import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './profiles.entity';
import { Repository } from 'typeorm';
import { UpdateUserProfileDto } from './profiles.dto';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(UserProfile)
        private userProfileRepository: Repository<UserProfile>,
      ) {}
    
      async findByUser(userId: number): Promise<UserProfile> {
        const profile = await this.userProfileRepository.findOne({ 
          where: { user: { id: userId } },
          relations: ['user'],
        });
      
        if (!profile) {
          throw new NotFoundException(`Hồ sơ cho ID người dùng ${userId} không được tìm thấy`);
        }
      
        return profile;
      }
    
      async update(id: number, dto: UpdateUserProfileDto): Promise<UserProfile> {
        const profile = await this.userProfileRepository.findOne({ where: { id } });
      
        if (!profile) {
          throw new NotFoundException(`Không tìm thấy hồ sơ với ID ${id}`);
        }
      
        Object.assign(profile, dto);
        return this.userProfileRepository.save(profile);
      }
}
