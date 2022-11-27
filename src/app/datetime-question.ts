import { QuestionBase } from './question-base';

export class DateTimeQuestion extends QuestionBase<Date> {
  controlType = 'datetime';
}
