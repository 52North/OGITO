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
  @Input() featureLayer: any;
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
        console.log ('que tiene this.featureLayer en questionSubscription', data , this.featureLayer );
      },
      error => console.log ('Error in subscription to questions ', error)    );
    this.showFormSubscription = this.showForm.subscribe(
      data => {
        this.showForm$ = observableOf(data);
      },
      error => console.log('error showing form', error)
      );

  }

  closeForm(){
    this.showForm$ = observableOf(false);
  }

  onSubmit() {
    // this.payLoad = JSON.stringify(this.form.getRawValue());
    this.payLoad = this.form.getRawValue(); // get the values in JSON
    console.log('it was submited', this.payLoad, this.featureLayer);
    this.dataForm = this.payLoad;
    this.payLoadSource.next(this.payLoad);
    this.formSubmitted.emit({payload: this.payLoad, feature: this.featureLayer.feature, layerName: this.featureLayer.layerName});
    // this.dataForm.resolve(this.payLoad));
   // this.dataForm = of(this.payLoad);
  }


// get isValid() { return this.form.controls[this.questions[key].valid;}
ngOnDestroy() {
  this.questionsSubscription.unsubscribe();
}

}
