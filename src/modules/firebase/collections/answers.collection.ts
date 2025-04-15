import { Injectable } from '@nestjs/common';
import { Collection } from 'fireorm';

@Injectable()
// @Collection('answers')
export class Answer {
    id: string;
    value: string;
    question_id: string;
}