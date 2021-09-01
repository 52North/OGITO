import { Injectable } from '@angular/core';
import {AppConfiguration} from './app-configuration';
import { DropdownQuestion } from './dropdown-question';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './textbox-question';
import { CheckBoxQuestion } from './check-box-question';
import { SliderQuestion } from './slider-question';
import {of, Subject} from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  // #TODO no estoy segura de esta definicion
/*  questions = { layerName: string,
               QuestionBase [] }; */

 questions = {};
  private showEditFormSource = new Subject<boolean>();
  showEditForm$ = this.showEditFormSource.asObservable();

  updateShowEditForm(showForm: boolean){
    this.showEditFormSource.next(showForm);
  }
 setLayerQuestions(layerName: string, qgisFieldList: any) {
    /**
     * forms the question from a list of fields;
     */
    // action plan layer treated in a different way
    if (layerName.toLowerCase() === 'massnahmen_laute'){
      return (this.setLayerQuestionsActionPlanNoise(layerName, qgisFieldList));
    }


  let order = 0;
  let layerQuestions: QuestionBase<any>[]=[];
  let question = null;
  let orderInLayer = false;
  // check if there is an specific order
  // console.log(' no la consigue + typeof(AppConfiguration.fieldsOrder[layerName])',layerName, typeof(AppConfiguration.fieldsOrder[layerName]));
  if (typeof(AppConfiguration.fieldsOrder[layerName]) !== 'undefined'){
     orderInLayer = true;
   }

  qgisFieldList.forEach(attr => {
   if (!(attr.name === 'id' || attr.name === 'fid' || attr.name === 'picfilepath' || attr.name === 'linkqrfile')){
     // #TODO add the code for the QR thing
     order = order + 1;
    // possibility to use comment as label for the field
    let label = (attr.comment === '') ? (attr.name) : (attr.comment);
    const required = false;
    switch (attr.type) {
      case 'bool': {
        question = new CheckBoxQuestion({
          key: attr.name,
          label,
          value: 'true',  // if checked then it will get the true value
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
        // #TODO change the double type to int in the table for noise intensity
        question = new TextboxQuestion ({
          key: attr.name,
          label,
          value: '',
          required,
          order: orderInLayer ? this.findOrder(layerName, attr.name) : order,
        });
        break;
      }
    }

     // id are reserved to be serial and PK in the DB
     // console.log('question in setLayerQuestions', question);

     layerQuestions.push(question);
   }
  });
  return layerQuestions;
 }

  setLayerQuestionsActionPlanNoise(layerName: string, qgisFieldList: any) {
    /**
     * forms the question from a list of fields;
     */
    // action plan layer treated in a different way
    let order = 0;
    let layerQuestions: QuestionBase<any>[]=[];
    let question = null;
    let orderInLayer = false;
    // check if there is an specific order
    // console.log(' no la consigue + typeof(AppConfiguration.fieldsOrder[layerName])',layerName, typeof(AppConfiguration.fieldsOrder[layerName]));
    if (typeof(AppConfiguration.fieldsOrder[layerName]) !== 'undefined'){
      orderInLayer = true;
    }

    qgisFieldList.forEach(attr => {
      if (!(attr.name === 'id' || attr.name === 'fid' || attr.name === 'picfilepath' || attr.name === 'linkqrfile')){
        // #TODO add the code for the QR thing
        order = order + 1;
        // possibility to use comment as label for the field
        const label = (attr.comment === '') ? (attr.name) : (attr.comment);
        const required = true;
        // only boolean fields, those are the measures
        if (attr.type === 'bool') {
            question = new CheckBoxQuestion({
              key: attr.name,
              label,
              value: 'true',  // if checked then it will get the true value
              required,
              order: orderInLayer ? this.findOrder(layerName, attr.name) : order,
              type: 'checkbox'
            });
            layerQuestions.push(question);
        }
      }
    });
    return layerQuestions;
  }
  findOrder(layerName: string, attrName: any){
    // console.log('attrName + layerName', layerName, attrName);
    let order = 0;
    if (typeof (AppConfiguration.fieldsOrder[layerName]) !== 'undefined'){
      // console.log('AppConfiguration.fieldsOrder[layerName][attrName]', AppConfiguration.fieldsOrder[layerName][attrName]);
      if (typeof(AppConfiguration.fieldsOrder[layerName][attrName]) !== 'undefined'){
         return(AppConfiguration.fieldsOrder[layerName][attrName]);
       }
    }
    return null;
  }


  findMinRange(attrName: any){
    // console.log('attrName',attrName);
  let min = AppConfiguration.range.min;
  if (typeof (AppConfiguration.ranges[attrName]) !== 'undefined') {
      min = AppConfiguration.ranges[attrName].min;
  }
  return min;
  }

  findMaxRange(attrName: any){
    let max = AppConfiguration.range.max;
    if (typeof (AppConfiguration.ranges[attrName])!== 'undefined') {
      max = AppConfiguration.ranges[attrName].max;
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
    console.log('this.question in QG service', this.questions);

  }

  getQuestions(layerName: any){
    return (this.questions[layerName].sort((a, b) => a.order - b.order));
  }
  toFormGroup(questions: QuestionBase<string>[] ) {
    const group: any = {};

    questions.forEach(question => {

      if (question.controlType === 'checkbox') {
        group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
          : new FormControl( false); // workaround...
        return;
      }

      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });
    console.log('from group un Question Service', new FormGroup(group));
    return new FormGroup(group);
  }


}
