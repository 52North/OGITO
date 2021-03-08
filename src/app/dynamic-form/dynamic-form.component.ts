import {Component, Input, OnInit} from '@angular/core';
import {Observable, of as observableOf, Subscription} from 'rxjs';
import {QuestionService} from '../question-service.service';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '../question-base';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  showForm$: Observable<boolean>;
  // @Input() questions: QuestionBase<string>[] = [];
  // new approach
  @Input() questions: Observable<QuestionBase<string>[]>;
  @Input() showForm: Observable<boolean>;
  sQuestions: QuestionBase<string>[];
  form: FormGroup;
  payLoad = '';
  private questionsSubscription: Subscription;
  private showFormSubscription: Subscription;


  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.showForm$ = observableOf(false);
    this.questionsSubscription = this.questions.subscribe(
      data => {
        this.sQuestions = data;
        this.form = this.questionService.toFormGroup(data);
        console.log ('que hace despues de formar grupos', this.form);
      },
      error => console.log ('Error in subscription to questions ', error)    );
    this.showFormSubscription = this.showForm.subscribe(
      data => {
        this.showForm$ = observableOf(data);
      },
      error => console.log('error showing layer panel')
      );
    /*this.questionService.showEditForm$.subscribe(data => {
        this.showForm$ = observableOf(data);
      },
      error => console.log('error showing layer panel'));*/
  }


  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }


// get isValid() { return this.form.controls[this.questions[key].valid;}
ngOnDestroy() {
  this.questionsSubscription.unsubscribe();
}

}
