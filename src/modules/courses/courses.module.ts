import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "./courses.entity";
import { CoursesService } from "./courses.service";
import { CoursesController } from "./courses.controller";
import { User } from "../users/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Course, User])],
    providers: [CoursesService],
    controllers: [CoursesController],
    exports: [CoursesService],
  })
  export class CoursesModule {}