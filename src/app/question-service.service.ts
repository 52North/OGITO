import { Injectable } from '@angular/core';

import { DropdownQuestion } from './dropdown-question';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './textbox-question';
import { CheckBoxQuestion } from './check-box-question';
import { of } from 'rxjs';

@Injectable()
export class QuestionService {
  // #TODO no estoy segura de esta definicion
/*  questions = { layerName: string,
               QuestionBase [] }; */

 questions = {};

 setLayerQuestions(qgisFieldList:any) {
    /**
     * forms the question from a list of fields;
     */
  let order = 0;
  const layerQuestions: QuestionBase<any>[]=[];
  let question = null;
  qgisFieldList.forEach(attr => {
    order = order + 1;
    // possibility to use comment as label for the field
    const label = (attr.comment === '') ? (attr.name) : (attr.comment);
    switch (attr.type) {
      case 'bool': {
        question = new CheckBoxQuestion({
          key: attr.name,
          label,
          value: '',
          required: true,
          order
        });
        break;
      }
      case 'QString': {
        question = new TextboxQuestion({
          key: 'attr.name',
          label,
          value: '',
          required: true,
          order
        });
        break;
      }
      case 'int': {
        break;
      }
      case 'double': {
        break;
      }
      case 'qlonglong': {
        break;
      }
    }
    layerQuestions.push(question);
  });
  return layerQuestions;
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
         this.questions['layer.layerName'] = questions; // no estoy segura de esto, es un dic...
        }
      });
    });
  }

  getQuestions(layerName: any){
    return of(this.questions[layerName].sort((a, b) => a.order - b.order));
  }
}
