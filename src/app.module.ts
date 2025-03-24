import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './modules/users/profiles/profiles.module';
import { ProfessionsService } from './modules/users/professions/professions.service';
import { ProfessionsModule } from './modules/users/professions/professions.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ChaptersModule } from './modules/courses/chapters/chapters.module';
import { LecturesModule } from './modules/courses/chapters/lectures/lectures.module';
import { CentralInformationModule } from './modules/central_information/central-information.module';
import { RoomModule } from './modules/central_information/rooms/room.module';
import { MediaModule } from './modules/medias/medias.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    ProfilesModule,
    ProfessionsModule,
    CoursesModule,ChaptersModule, LecturesModule,
    CentralInformationModule,RoomModule,
    MediaModule
  ],
  controllers: [AppController],
  providers: [AppService, ProfessionsService],
})
export class AppModule {}
