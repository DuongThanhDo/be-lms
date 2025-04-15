import * as _ from 'lodash';
import { Question } from '../collections/questions.collection';

export class AnswerMapper {
  static toAnswerMapper = (collection: Question) => ({
    value: _.get(collection, 'value'),
    question_id: _.get(collection, 'question_id'),
  });
}