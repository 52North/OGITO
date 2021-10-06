import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, NgModule, ElementRef, ViewChild} from '@angular/core';
import {Observable, of, of as observableOf, Subject, Subscription} from 'rxjs';
import {QuestionService} from '../question-service.service';
import {FormGroup, Validators, FormsModule} from '@angular/forms';
import { QuestionBase } from '../question-base';
import {MatSnackBar} from '@angular/material/snack-bar';
import Keyboard from 'simple-keyboard';
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, AfterViewInit {
  showForm$: Observable<boolean>;
  // @Input() questions: QuestionBase<string>[] = [];
  // new approach
  @Input() questions: Observable<QuestionBase<string>[]>;
  @Input() showForm: Observable<boolean>;
  @Input() featureLayer: any;
  @Output() formSubmitted = new EventEmitter<any>();
  @Input() dataForm: any;
  @ViewChild('keyboard') elRef: ElementRef;
  @ViewChild('input') input;
  sQuestions: QuestionBase<string>[];
  form: FormGroup;
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
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.showForm$ = observableOf(false);
    this.keyboardVisible = true;
    this.questionsSubscription = this.questions.subscribe(
      data => {
        this.sQuestions = data;
        this.form = this.questionService.toFormGroup(data);
        // console.log ('que tiene this.featureLayer en questionSubscription', data , this.featureLayer );

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
    // initialize the virtual keyboard
    //console.log('this.keyboard', this.keyboard);
    if (this.keyboardVisible) {
      // console.log('keyboard is Visible', this.keyboardVisible, 'style', this.elRef.nativeElement.className);
      this.keyboardVisible = false;
      // this.keyboard = null;
      this.elRef.nativeElement.innerHTML = ''; // remove the keyboard
      return;
    }
    // console.log('make keyboard visible', this.keyboardVisible, 'style', this.elRef.nativeElement.className);
    this.keyboardVisible = true;
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button)
    });
  }

  onChange = (input: string) => {
    this.value = input;
    // here emit the event (https://stackoverflow.com/questions/62981935/change-event-is-not-firing)...
   //  console.log('Input changed', input);
  };


  onKeyPress = (button: string) => {
    // console.log('Button pressed', button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === '{shift}' || button === '{lock}') this.handleShift();
  };

  onInputFocusOut(event: any, questionKey: any){
    // workaround to set the value of the control form
    // get the control and set the value
    this.controlInput = this.form.get(questionKey);
    // console.log(this.controlInput);
  }

  onInputChange = (event: any, questionKey: any) => {
  // this event is not being fired when the user add the value with the keyboard
    try {
      // console.log('event and target', event.target, event.target.value);
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
    // this.payLoad = JSON.stringify(this.form.getRawValue());
    // here add workaround fot the virtual keyboard
    if (this.input && this.input.nativeElement.value.length > 0){
      // set the value to the input control, this should work for both manual entry and by keyboard
      // this can be used just for keyboard -->  let this.controlInput.setValue(this.keyboard.getInput());
      this.controlInput.setValue( this.input.nativeElement.value);
    }
    // console.log('it was submited', this.payLoad, this.featureLayer);
    // prepare and submit the event
    this.payLoad = this.form.getRawValue(); // get the values in JSON
    this.dataForm = this.payLoad;
    this.payLoadSource.next(this.payLoad);
    this.formSubmitted.emit({payload: this.payLoad, feature: this.featureLayer.feature, layerName: this.featureLayer.layerName});
    // make the keyboard not visible
    this.keyboardVisible = false;
  }

  showQuestionValue(elementID: any, value: any){
    //console.log('showing value of slider', elementID, value);
    const label = document.getElementById(elementID);
    // console.log('label', label);
    if (label)
    { // console.log('label', label);
       label.innerHTML = value; }
  }
  stopMoving($event: any){
    $event.stopImmediatePropagation();
    // console.log('deja de moverse?');
  }


  checkingChecks(questionKey: any, value: any){
    // console.log('showing value of questionKey', questionKey, value);
    // change here the requirement of 'required'?
    // peers for validation, laermquelle_auto and intensitaet_auto
    const prefix_intensity = 'intensitaet_';
    const prefix_source = 'laermquelle_';
    const peersToCheck = ['auto', 'schiene', 'sonstiges'];
    const questions_source = peersToCheck.map(x => prefix_source.concat(x));
    // console.log('subFix', questions_source);
    const questions_intensity = peersToCheck.map(x => prefix_intensity.concat(x));
    // console.log('subFix', questions_intensity);
    const subFix = questionKey.substring(prefix_intensity.length, questionKey.length);
    // console.log('subFix', subFix);
    if (questions_source.findIndex(x => x === questionKey) >= 0) {
        let controlIntensity = this.form.get(prefix_intensity.concat(subFix));
        let controlSource = this.form.get(prefix_source.concat(subFix));
        // add code to
        if (value){
          // controlIntensity.setValidators(Validators.required);
          controlIntensity.setValidators(Validators.compose(
             [Validators.min(1),
              Validators.required]
            ));
          controlIntensity.updateValueAndValidity();
          // console.log('controlIntensity after', controlIntensity);
          return;
        }
        if (!value){
          // reset the slider
          controlIntensity.setValue(0);
          this.showQuestionValue(prefix_intensity.concat(subFix), 0);
          // update the mat-slider
          controlIntensity.clearValidators();
          controlIntensity.updateValueAndValidity();
          // console.log('controlIntensity after', controlIntensity);
          // console.log('controlSource after', controlSource);

        }
      }


  }

// get isValid() { return this.form.controls[this.questions[key].valid;}
ngOnDestroy() {
  this.questionsSubscription.unsubscribe();
}


}
