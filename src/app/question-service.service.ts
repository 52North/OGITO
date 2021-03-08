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
 setLayerQuestions(qgisFieldList:any) {
    /**
     * forms the question from a list of fields;
     */
  let order = 0;
  let layerQuestions: QuestionBase<any>[]=[];
  let question = null;
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
          value: '',
          required,
          order
        });
        break;
      }
      case 'QString': {
        question = new TextboxQuestion({
          key: attr.name,
          label,
          value: '',
          required,
          order
        });
        break;
      }
      case 'int': {
        question = new SliderQuestion({
          key: attr.name,
          label,
          value: 0,
          required,
          order,
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
          order,
        });
        break;
      }
    }

     // id are reserved to be serial and PK in the DB
     layerQuestions.push(question);
   }
  });
  return layerQuestions;
 }


  findMinRange(attrName: any){
    // console.log('attrName',attrName);
  let min = AppConfiguration.range.min;
    if (typeof (AppConfiguration.ranges[attrName])!== 'undefined') {
      min = AppConfiguration.ranges[attrName].min;
  }
  return min;
  }

  findMaxRange(attrName: any){
    let min = AppConfiguration.range.min;
    if (typeof (AppConfiguration.ranges[attrName])!== 'undefined') {
      min = AppConfiguration.ranges[attrName].max;
    }
    return min;
  }

  setQuestions(layerGroups){
    /**
     * builds all the questions for all the layers
     *
     */
    layerGroups.forEach( group =>{
      group.layers.forEach(layer =>{
        if (layer.wfs) {
         const questions = this.setLayerQuestions(layer.fields);
         this.questions[layer.layerName] = questions; // no estoy segura de esto, es un dic...
         // console.log('this.questions[\'layer.layerName\'] in QG service', layer.layerName, this.questions['layer.layerName']);
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
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });
    console.log('from group un Question Service', new FormGroup(group));
    return new FormGroup(group);
  }


}
