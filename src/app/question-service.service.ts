import { DateTimeQuestion } from './datetime-question';
import { Injectable } from '@angular/core';
import {AppConstants} from './app-constants';
import { DropdownQuestion } from './dropdown-question';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './textbox-question';
import { CheckBoxQuestion } from './check-box-question';
import { SliderQuestion } from './slider-question';
import {of, Subject} from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ProjectConfiguration } from './config/project-config';
import { OpenLayersService } from './open-layers.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
 questions = {};
  private showEditFormSource = new Subject<boolean>();
  showEditForm$ = this.showEditFormSource.asObservable();
  private loadedProject: ProjectConfiguration;


  constructor (private openLayersService: OpenLayersService){
    this.openLayersService.qgsProjectUrl$.subscribe(
      (data) => {
        if (data) {
          this.loadedProject = data;
        }
      },
      (error) => {
        console.log('error while updating loaded project', error);
      }
    );
  }

  updateShowEditForm(showForm: boolean){
    this.showEditFormSource.next(showForm);
  }
 setLayerQuestions(layerName: string, qgisFieldList: any) {
    /**
     * forms the question from a list of fields;
     */
    // action plan layer treated in a different way
    if (this.loadedProject.rateMeasureLayers && this.loadedProject.rateMeasureLayers.includes(layerName)){
      return (this.setLayerQuestionsRateMeasures(layerName.toLowerCase(), qgisFieldList));
    }

  let order = 0;
  let layerQuestions: QuestionBase<any>[]=[];
  let question = null;
  let orderInLayer = false;
  // check if there is an specific order
  if (typeof(AppConstants.fieldsOrder[layerName.toLowerCase()]) !== 'undefined'){
     orderInLayer = true;
   }

  qgisFieldList.forEach(attr => {
   if (!(attr.name === 'id' || attr.name === 'fid' || attr.name === 'picfilepath' || attr.name === 'linkqrfile')){
     order = order + 1;
    let label = (attr.comment === '') ? (attr.name) : (attr.comment);
    const required = false;
    switch (attr.type) {
      case 'bool': {
        question = new CheckBoxQuestion({
          key: attr.name,
          label,
          value: 'true',
          required,
          order: orderInLayer ? this.findOrder(layerName, attr.name) : order,
          type: 'checkbox'
        });
        break;
      }
      case 'QString': {
        question = new TextboxQuestion({
          key: attr.name,
          label,
          value: '',
          required,
          order: orderInLayer ? this.findOrder(layerName, attr.name) : order,
        });
        break;
      }
      case 'int': {
        question = new SliderQuestion({
          key: attr.name,
          label,
          value: 0,
          required,
          order: orderInLayer ? this.findOrder(layerName, attr.name) : order,
          min: this.findMinRange(attr.name),
          max: this.findMaxRange(attr.name),
        });
        break;
      }
      case 'double': {
        // Noise intensity must be int in the table
        question = new TextboxQuestion ({
          key: attr.name,
          label,
          value: '',
          required,
          order: orderInLayer ? this.findOrder(layerName, attr.name) : order,
        });
        break;
      }
      case 'QDate':
      case 'QDateTime': {
        question = new DateTimeQuestion ({
          key: attr.name,
          label,
          value: new Date(),
          required,
          order: orderInLayer ? this.findOrder(layerName, attr.name) : order,
        });
        break;
      }
    }
 layerQuestions.push(question);
   }
  });
  return layerQuestions;
 }

  setLayerQuestionsRateMeasures(layerName: string, qgisFieldList: any) {
    /**
     * forms the question from a list of fields;
     */
    // action plan layer treated in a different way
    let order = 0;
    let layerQuestions: QuestionBase<any>[]=[];
    let question = null;
    let orderInLayer = false;
    // check if there is an specific order
    if (typeof(AppConstants.fieldsOrder[layerName]) !== 'undefined'){
      orderInLayer = true;
    }
    qgisFieldList.forEach(attr => {
      if (!(attr.name === 'id' || attr.name === 'fid' || attr.name === 'picfilepath' || attr.name === 'linkqrfile')){
        order = order + 1;
        const label = (attr.comment === '') ? (attr.name) : (attr.comment);
        const required = true;
        // only boolean fields, those are the measures
        if (attr.type === 'bool') {
            question = new CheckBoxQuestion({
              key: attr.name,
              label,
              required:false,
              order: orderInLayer ? this.findOrder(layerName, attr.name) : order,
              type: 'checkbox'
            });
            layerQuestions.push(question);
        }
        if (attr.type === 'QString') {
          question = new TextboxQuestion({
            key: attr.name,
            label,
            value: '',  // if checked then it will get the true value
            required: false,
            order: orderInLayer ? this.findOrder(layerName, attr.name) : order,
          });
          layerQuestions.push(question);
        }
      }
    });
    return layerQuestions;
  }
  findOrder(layerName: string, attrName: any){
    layerName = layerName.toLowerCase(); // ensure lower case
    let order = 0;
    if (typeof (AppConstants.fieldsOrder[layerName]) !== 'undefined'){
     if (typeof(AppConstants.fieldsOrder[layerName][attrName]) !== 'undefined'){
         return(AppConstants.fieldsOrder[layerName][attrName]);
       }
    }
    return null;
  }

  findMinRange(attrName: any){
  let min = AppConstants.range.min;
  if (typeof (AppConstants.ranges[attrName]) !== 'undefined') {
      min = AppConstants.ranges[attrName].min;
  }
  return min;
  }

  findMaxRange(attrName: any){
    let max = AppConstants.range.max;
    if (typeof (AppConstants.ranges[attrName])!== 'undefined') {
      max = AppConstants.ranges[attrName].max;
    }
    return max;
  }

  setSketchQuestions(sketchName: string, fields: any) {
    // set the questions for a new Sketch layer
    // by default details a varchar field
    const questions = this.setLayerQuestions(sketchName, fields);
    this.questions[sketchName] = questions;
  }

  setQuestions(layerGroups){
    /**
     * builds all the questions for all the layers
     *
     */
    layerGroups.forEach( group =>{
      group.layers.forEach(layer =>{
        if (layer.wfs) {
         const questions = this.setLayerQuestions(layer.layerName, layer.fields);
         this.questions[layer.layerName] = questions; // no estoy segura de esto, es un dic...
        }
      });
    });
    }

  getQuestions(layerName: any){
    return (this.questions[layerName].sort((a, b) => a.order - b.order));
  }
  toFormGroup(questions: QuestionBase<string>[] ) {
    const group: any = {};
   questions.forEach(question => {
    if (question.controlType === 'checkbox') {
        group[question.key] = question.required ? new UntypedFormControl(question.value || '', Validators.required)
          : new UntypedFormControl( false); // workaround...
        return;
      }
    group[question.key] = question.required ? new UntypedFormControl(question.value || '', Validators.required)
        : new UntypedFormControl(question.value || '');
    });
    return new UntypedFormGroup(group);
  }


}
