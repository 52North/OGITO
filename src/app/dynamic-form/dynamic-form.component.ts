import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, NgModule, ElementRef, ViewChild} from '@angular/core';
import {Observable, of, of as observableOf, Subject, Subscription} from 'rxjs';
import {QuestionService} from '../question-service.service';
import {UntypedFormGroup, Validators, FormsModule} from '@angular/forms';
import { QuestionBase } from '../question-base';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import Keyboard from 'simple-keyboard';
import { LabelLutService } from '../config/label-lut.service';
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, AfterViewInit {
  showForm$: Observable<boolean>;
  @Input() questions: Observable<QuestionBase<string>[]>;
  @Input() showForm: Observable<boolean>;
  @Input() featureLayer: any;
  @Output() formSubmitted = new EventEmitter<any>();
  @Input() dataForm: any;
  @ViewChild('keyboard') elRef: ElementRef;
  @ViewChild('input') input;
  sQuestions: QuestionBase<string>[];
  form: UntypedFormGroup;
  payLoad = '';
  value = '';
  keyboard: Keyboard;
  keyboardVisible: boolean;
  controlInput: any;
  checkBoxChecked = false;  // workaround to solve the issue that checkbox are shown ckecked by default.
  payLoadSource = new Subject <any>();
  payLoad$ = this.payLoadSource.asObservable();

  private questionsSubscription: Subscription;
  private showFormSubscription: Subscription;

  constructor(private questionService: QuestionService,
              private snackBar: MatSnackBar, private labelLUT: LabelLutService) { }

  ngOnInit(): void {
    this.showForm$ = observableOf(false);
    this.keyboardVisible = true;
    this.questionsSubscription = this.questions.subscribe(
      data => {
        this.sQuestions = data;
        this.form = this.questionService.toFormGroup(data);
      },
      error => console.log ('Error in subscription to questions ', error)    );
    this.showFormSubscription = this.showForm.subscribe(
      data => {
        this.showForm$ = observableOf(data);
      },
      error => console.log('error showing form', error)
      );
    const div = document.createElement('div');
    div.className += 'simple-keyboard';
    document.body.appendChild(div);

  }

  ngAfterViewInit() {
    this.payLoadSource.next(true);  // it should be drawn..
    this.keyboardVisible = false; // after rendering the div it must be invisible;
  }

  showKeyboard(){
    // make the keyboard visible
    if (this.keyboardVisible) {
      this.keyboardVisible = false;
      this.elRef.nativeElement.innerHTML = ''; // remove the keyboard
      return;
    }
    this.keyboardVisible = true;
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button)
    });
  }

  onChange = (input: string) => {
    this.value = input;
  };


  onKeyPress = (button: string) => {
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === '{shift}' || button === '{lock}') this.handleShift();
  };

  onInputFocusOut(event: any, questionKey: any){
    // workaround to set the value of the control form, get the control and set the value
    this.controlInput = this.form.get(questionKey);
  }

  onInputChange = (event: any, questionKey: any) => {
    try {
      if (this.keyboard){
        this.keyboard.setInput(event.target.value);
      }
    }
    catch (e) {
      console.log(e, 'Perhaps the virtual keyboard is not being used?');
    }
  }

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';
    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };


  closeForm(){
    this.showForm$ = observableOf(false);
  }


  onSubmit() {
    //What is this for?
    /*if (this.input && this.input.nativeElement.value.length > 0){
      this.controlInput.setValue( this.input.nativeElement.value);
    }*/
    // prepare and submit the event
    this.payLoad = this.form.getRawValue(); // get the values in JSON
    this.dataForm = this.payLoad;
    this.payLoadSource.next(this.payLoad);
    this.formSubmitted.emit({payload: this.payLoad, feature: this.featureLayer.feature, layerName: this.featureLayer.layerName});
    // make the keyboard not visible
    this.keyboardVisible = false;
  }

  showQuestionValue(elementID: any, value: any){
    const label = document.getElementById(elementID);
    if (label)
    {
       label.innerHTML = value; }
  }
  stopMoving($event: any){
    $event.stopImmediatePropagation();
  }


  checkingChecks(questionKey: any, value: any){
    // change here the requirement of 'required'?
    // peers for validation, laermquelle_auto and intensitaet_auto
    const prefix_intensity = 'intensitaet_';
    const prefix_source = 'laermquelle_';
    const peersToCheck = ['auto', 'schiene', 'sonstiges'];
    const questions_source = peersToCheck.map(x => prefix_source.concat(x));
    const questions_intensity = peersToCheck.map(x => prefix_intensity.concat(x));
    const subFix = questionKey.substring(prefix_intensity.length, questionKey.length);
    if (questions_source.findIndex(x => x === questionKey) >= 0) {
        let controlIntensity = this.form.get(prefix_intensity.concat(subFix));
        let controlSource = this.form.get(prefix_source.concat(subFix));
        if (value){
         controlIntensity.setValidators(Validators.compose(
             [Validators.min(1),
              Validators.required]
            ));
          controlIntensity.updateValueAndValidity();
          return;
        }
        if (!value){
          controlIntensity.setValue(0);
          this.showQuestionValue(prefix_intensity.concat(subFix), 0);
          // update the mat-slider
          controlIntensity.clearValidators();
          controlIntensity.updateValueAndValidity();
        }
      }


  }

  getLabel(propertyName: string){
    return this.labelLUT.getLabelForPropertyName(this.featureLayer.layerName, propertyName);
  }

// get isValid() { return this.form.controls[this.questions[key].valid;}
ngOnDestroy() {
  this.questionsSubscription.unsubscribe();
}


}
