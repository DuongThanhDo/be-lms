import { Injectable } from '@nestjs/common';
import { Collection, ISubCollection, SubCollection } from 'fireorm';
import { Answer } from './answers.collection';
import { AnswerCorrect } from './answer_correct.collection';

@Injectable()
// @Collection('question')
export class Question {
    id: string;
    name: string;
    type: string;
    results: [];
    explain: string;

    @SubCollection(Answer)
    answers?: ISubCollection<Answer>;

    @SubCollection(AnswerCorrect)
    answerCorrectModel?: ISubCollection<AnswerCorrect>;
}