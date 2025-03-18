import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateUserProfileDto } from './profiles.dto';

@Controller('user-profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  findByUser(@Param('userId') userId: number) {
    return this.profilesService.findByUser(userId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.profilesService.update(id, updateUserProfileDto);
  }
}
