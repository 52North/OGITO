import { QuestionBase } from './question-base';
export class CheckBoxQuestion extends QuestionBase<string> {
  controlType = 'checkbox';
  min = 0;
  max = 0;
}

