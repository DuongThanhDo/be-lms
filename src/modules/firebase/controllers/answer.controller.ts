import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';
  import { Request, Response } from 'express';
import { AnswerService } from '../services/answer.service';
import { Answer } from '../collections/answers.collection';
import { AnswerBulkModel } from '../models/answer.bulk.model';

  
  @ApiTags('Answer')
  @Controller('')
  export class AnswerController {
    constructor(private answerService: AnswerService) {}
  
    /**
     *
     * @param req
     * @param res
     * @param body
     * @returns
     */
    @Post('answer')
    async create(
      @Res() res: Response,
      @Body() body: Answer,
    ) {
      try {
        const { id } = body;
        const data = await this.answerService.createAnswer({
          id,
          body,
        });
        console.log(data);
        return res.status(200).json(data);
      } catch (error) {
        res.status(500).send('An error occurred');
      }
    }
  
    @Get('quiz/:quiz_id/question/:question_id/answers')
    async get(
      @Param('quiz_id') quiz_id: string,
      @Param('question_id') question_id: string,
      @Res() res: Response,
    ) {
      try {
        const result = await this.answerService.all(quiz_id, question_id);
  
        return res.status(200).json({
          data: [...result],
        });
      } catch (error) {
        res.status(500).send('An error occurred');
      }
    }
  
    @Delete('quiz/:quiz_id/question/:question_id/answer/:answer_id')
    async delete(
      @Param('quiz_id') quiz_id: string,
      @Param('question_id') question_id: string,
      @Param('answer_id') answer_id: string,
      @Res() res: Response,
    ) {
      try {
        await this.answerService.remove(quiz_id, question_id, answer_id);
        return res.status(200).send('Remove collection successfull !');
      } catch (error) {
        res.status(500).send('An error occurred');
      }
    }
  
    @Put('quiz/:quiz_id/question/:question_id/answer/:answer_id')
    async update(
      @Param('quiz_id') quiz_id: string,
      @Param('question_id') question_id: string,
      @Param('answer_id') answer_id: string,
      @Body() body: Answer,
      @Res() res: Response,
    ) {
      try {
        const data = await this.answerService.update(
          quiz_id,
          question_id,
          answer_id,
          body,
        );
        return res.status(200).json(data);
      } catch (error: any) {
        return res.status(500).send('Update sucessful');
      }
    }
  
    @Put('quiz/:quiz_id/question/:question_id/answers')
    async updateBulk(
      @Param('quiz_id') quiz_id: string,
      @Param('question_id') question_id: string,
      @Body() body: AnswerBulkModel,
      @Res() res: Response,
    ) {
      try {
        await this.answerService.updateBulk(quiz_id, question_id, body);
        return res.status(200).send('Update collection successfull !');
      } catch (error: any) {
        return res.status(500).send('An error occurred');
      }
    }
  }