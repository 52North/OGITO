import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable, of, of as observableOf, Subject, Subscription} from 'rxjs';
import {QuestionService} from '../question-service.service';
import {FormGroup, Validators} from '@angular/forms';
import { QuestionBase } from '../question-base';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  checkBoxChecked = false;  //workaround to solve the issue that checkbox are shown ckecked by default.
  payLoadSource = new Subject <any>();
  payLoad$ = this.payLoadSource.asObservable();
  // public dataForm: Promise<any>;
  private questionsSubscription: Subscription;
  private showFormSubscription: Subscription;


  constructor(private questionService: QuestionService,
              private snackBar: MatSnackBar) { }

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

  validateSubmittedData(data: any): boolean{
    // for now only validate for noise_laute_orte
    // peers to check:
    let formIsValid = true;
    const peersToCheck = ['auto', 'schiene', 'sonstiges'];
    for (let peer of peersToCheck){
      if ( data.hasOwnProperty('source_'.concat(peer)) && data['intensity_'.concat(peer)]) {
       console.log('source and intensity' + peer, data['source_'.concat(peer)], data['intensity_'.concat(peer)] );
       if (data['intensity_'.concat(peer)] === ''){
          console.log('data[\'intensity_\'.concat(peer)]', data['intensity_'.concat(peer)].toNumber());
          formIsValid = false;
          return formIsValid;
        }
      }
    }
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
  showQuestionValue(elementID: any, value: any){
    console.log('showing value of slider', elementID, value);

    const label = document.getElementById(elementID);
    // console.log('label', label);
    if (label)
    { // console.log('label', label);
       label.innerHTML = value; }
  }
  stopMoving($event: any){
    $event.stopImmediatePropagation();
    console.log('deja de moverse?');
  }


  checkingChecks(questionKey: any, value: any){
    console.log('showing value of questionKey', questionKey, value);
    // change here the requirement of 'required'?
    /*if (questionKey === 'source_auto'){
      let controlIntensity = this.form.get('intensity_auto');
      console.log('controlIntensity before', controlIntensity);
      controlIntensity.setValidators(Validators.required);
      controlIntensity.updateValueAndValidity();
      console.log('controlIntensity after', controlIntensity);
    } */
    const peersToCheck = ['auto', 'schiene', 'sonstiges'];
    const subFix = questionKey.substring(7, questionKey.length);
    if (peersToCheck.findIndex(x => x === subFix) >= 0) {
        let controlIntensity = this.form.get('intensity_'.concat(subFix));
        let controlSource = this.form.get('source_'.concat(subFix));
        // add code to
        if (value){
          // controlIntensity.setValidators(Validators.required);
          controlIntensity.setValidators(Validators.compose(
             [Validators.min(1),
              Validators.required]
            ));
          controlIntensity.updateValueAndValidity();
          console.log('controlIntensity after', controlIntensity);
          return;
        }
        if (!value){
          // reset the slider
          controlIntensity.setValue(0);
          this.showQuestionValue('intensity_'.concat(subFix), 0);
          // update the mat-slider
          controlIntensity.clearValidators();
          controlIntensity.updateValueAndValidity();
          console.log('controlIntensity after', controlIntensity);
          console.log('controlSource after', controlSource);

        }
      }


  }

// get isValid() { return this.form.controls[this.questions[key].valid;}
ngOnDestroy() {
  this.questionsSubscription.unsubscribe();
}

}
