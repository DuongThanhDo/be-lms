import {
    Body,
    Controller,
    Delete,
    Get,
    Next,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
    UsePipes,
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';
  import { Request, Response } from 'express';
import { QuestionService } from '../services/question.service';
import { Question } from '../collections/questions.collection';
import { QuestionDto } from '../dtos/question.dto';

  
  @Controller('questions')
  export class QuestionController {
    constructor(private questionService: QuestionService) { }
  
    /**
     *
     * @param req
     * @param res
     * @returns
     */
    @Post('')
    async create(
      @Res() res: Response,
      @Body() body: QuestionDto,
    ) {
      try {
        const { id } = body;
        const data = await this.questionService.createQuestion({
          id,
          body,
        });
        console.log("Data returned: ", data);
        return res.status(200).json(data);
      } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
      }
    }
  
    @Get('quizzes/:quizId/questions')
    async get(@Param('quizId') id: string, @Res() res: Response) {
      try {
        const result = await this.questionService.all(id);
  
        return res.status(200).json({
          data: [...result],
        });
      } catch (error) {
        return res.status(500).send('An error occurred');
      }
    }
  
    @Get('quizzes/:quizId/questions/:quesId/answer')
    async getAnswer(
      @Param('cateId') cateId: string,
      @Param('quesId') quesId: string,
      @Res() res: Response
    ) {
      try {
        const result = await this.questionService.getOne(cateId, quesId);
  
        return res.status(200).json({
          data: result,
        });
      } catch (error) {
        return res.status(500).send('An error occurred');
      }
    }
  
    @Delete('quizzes/:quizId/questions/:question_id')
    async delete(
      @Param('quizId') quizId: string,
      @Param('question_id') question_id: string,
      @Res() res: Response,
    ) {
      try {
        await this.questionService.remove(quizId, question_id);
        return res.status(200).send('Remove collection successfull !');
      } catch (error) {
        return res.status(500).send('An error occurred');
      }
    }
  
    @Put('quizzes/:quizId/question/:question_id')
    async update(
      @Param('quizId') quizId: string,
      @Param('question_id') question_id: string,
      @Body() body: Question,
      @Res() res: Response,
    ) {
      try {
        await this.questionService.update(quizId, question_id, body);
        return res.status(200).send('Update collection successfull !');
      } catch (error: any) {
        return res.status(500).send('An error occurred');
      }
    }
  }