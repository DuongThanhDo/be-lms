import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "./courses.entity";
import { CoursesService } from "./courses.service";
import { CoursesController } from "./courses.controller";
import { User } from "../users/user.entity";
import { Media } from "../medias/media.entity";
import { MediaModule } from "../medias/media.module";

@Module({
    imports: [TypeOrmModule.forFeature([Course, User, Media]), MediaModule],
    providers: [CoursesService],
    controllers: [CoursesController],
    exports: [CoursesService],
  })
  export class CoursesModule {}