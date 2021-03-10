import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable, of, of as observableOf, Subject, Subscription} from 'rxjs';
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
  @Output() formSubmitted = new EventEmitter<any>();
  @Input() dataForm: any;

  sQuestions: QuestionBase<string>[];
  form: FormGroup;
  payLoad = '';
  payLoadSource = new Subject <any>();
  payLoad$ = this.payLoadSource.asObservable();
  // public dataForm: Promise<any>;
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
      error => console.log('error showing form', error)
      );

  }

  async returnPromise(){
    /* const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Async Work Complete');
        resolve(this.payLoad);
      }, 1000);
    }); */
    return this.payLoad;
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
    console.log('it was submited', this.payLoad);
    this.dataForm = this.payLoad;
    this.payLoadSource.next(this.payLoad);
    this.formSubmitted.emit(this.payLoad);
    // this.dataForm.resolve(this.payLoad));
   // this.dataForm = of(this.payLoad);
  }


// get isValid() { return this.form.controls[this.questions[key].valid;}
ngOnDestroy() {
  this.questionsSubscription.unsubscribe();
}

}
