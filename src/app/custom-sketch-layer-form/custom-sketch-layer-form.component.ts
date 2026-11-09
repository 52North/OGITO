import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FieldConfig } from '../config/custom-sketch-layer-config';
import { CustomDialogService, EditedFeatureCustomSketchLayer } from '../custom-dialog.service';
import { Subscription } from 'rxjs';
import  VectorLayer  from 'ol/layer/Vector';
import Feature  from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import { EditLayer } from '../map/map.component';
import { evaluateFieldCondition } from './field-condition-evaluator';

@Component({
  selector: 'app-custom-sketch-layer-form',
  templateUrl: './custom-sketch-layer-form.component.html',
  styleUrls: ['./custom-sketch-layer-form.component.scss']
})
export class CustomSketchLayerFormComponent{
@Output() formSubmitted = new EventEmitter<any>();

  private subToInitDialog!: Subscription;
  private subToFormValueChanges: Subscription | null = null;
  private isVisible: boolean = false;

  public form!: FormGroup;
  public fields: FieldConfig[] = [];
  public layerName: string = '';
  public category = '';
  public allVisibleFieldIds = new Set<string>(); // track currently visible field IDs (for conditional fields)
  
  private feature: Feature;
  private layer: EditLayer;

  constructor(
    private fb: FormBuilder,
    private customDialogInitializer: CustomDialogService
  ) {}

  ngOnInit(): void {
    // Listen for the external event to open the dynamic form
    this.subToInitDialog = this.customDialogInitializer.customLayerDefinition$.subscribe(
      (data: EditedFeatureCustomSketchLayer) => {
        console.log("Received dynamic form init event");
        this.startDialog(data);
      },
      (error) => { console.log('Error in subscription to dynamic form service', error); }
    );
  }

  ngOnDestroy(): void {
    if (this.subToInitDialog) {
      this.subToInitDialog.unsubscribe();
    }
    if (this.subToFormValueChanges) {
      this.subToFormValueChanges.unsubscribe();
    }
  }

  public getVisibility(): boolean {
    return this.isVisible;
  }

  public isFieldVisible(field: FieldConfig): boolean {
    return this.allVisibleFieldIds.has(field.id);
  }

  private buildValidatorsFor(field: FieldConfig): ValidatorFn[] {
    const fieldValidators: ValidatorFn[] = [];
    if (field.required) {
      fieldValidators.push(Validators.required);
    }

    if (field.type === 'text' || field.type === 'textarea') {
      if (field.minLength !== undefined) {
        fieldValidators.push(Validators.minLength(field.minLength));
      }
      if (field.maxLength !== undefined) {
        fieldValidators.push(Validators.maxLength(field.maxLength));
      }
    }

    if (field.type === 'number') {
      if (field.min !== undefined) {
        fieldValidators.push(Validators.min(field.min));
      }
      if (field.max !== undefined) {
        fieldValidators.push(Validators.max(field.max));
      }
    }

    return fieldValidators;
  }

  public startDialog(data: EditedFeatureCustomSketchLayer): void {
    this.feature = data.feature;
    this.layer = data.layer;
    this.layerName = data.layerDefinition.layername;
    this.fields = data.layerDefinition.fields;
    this.category = data.feature.get("category");

    if (this.subToFormValueChanges) {
      this.subToFormValueChanges.unsubscribe();
    }

    // Build the Reactive Form based on the new configuration
    const formControls: { [key: string]: FormControl } = {};

    this.fields.forEach(field => {
      let initialValue = field.default !== undefined ? field.default : null;
      if (initialValue === 'now' && (field.type === 'date' || field.type === 'datetime')) {
        initialValue = this.getNowFormatted(field.type);
      }

      formControls[field.id] = new FormControl(
        {
          value: initialValue,
          disabled: field.readonly || false
        },
        this.buildValidatorsFor(field)
      );
    });

    this.form = this.fb.group(formControls);
    //check initial visibility of conditional fields
    this.updateFieldVisibility(this.form.getRawValue());
    //subscribe to form value changes to handle conditional field visibility
    this.subToFormValueChanges = this.form.valueChanges.subscribe(values => {
      this.updateFieldVisibility(values);
    });
    this.isVisible = true;

  }

  public abbortDialog(): void {
    // If you need to clean up the feature from the map layer on abort, do it here
    if (this.feature && this.layer) {
      try {
        this.layer.olLayer.getSource().removeFeature(this.feature);
      } catch (err) {
        console.error("Error while removing edit feature", err);
      }
    }

    if (this.layer) {
      this.customDialogInitializer.raiseCustomDialogClosed(this.layerName, true);
    }
    this.resetValues();
  }

  public submitDialog(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // reset values of hidden conditional fields to undefined before submitting the form so they don't get included in the payload
    // a conditional field's visibility may have flipped back and forth while the user filled in the form
    this.fields.forEach(field => {
      if (!this.allVisibleFieldIds.has(field.id)) {
        this.form.get(field.id)?.setValue(undefined, { emitEvent: false });
      }
    });

    const formValues = this.form.getRawValue();

    // Emit the payload matching your edit-reporting component output signature
    const now = new Date();
    this.feature.set("inserted", now.toISOString());
    this.feature.set("layername", this.layerName);
    this.feature.set("payload", JSON.stringify(formValues));
    this.feature.set("category", this.category); // Assuming there's a category field in the form

    this.formSubmitted.emit({
      payload: formValues,
      feature: this.feature,
      layerName: this.layerName
    });

    if (this.layer) {
      this.customDialogInitializer.raiseCustomDialogClosed(this.layerName, false);
    }
    this.resetValues();
  }

  public getMinMaxLabel(field: FieldConfig): string {
    let label = "";

    if(field.type === 'number'){
      const min = field.min !== undefined ? `min: ${field.min}` : '';
      const max = field.max !== undefined ? `max: ${field.max}` : '';
      label = [min, max].filter(part => part).join(', ');
    }

    if(label !== ""){
      label = `(${label})`;
    }

    return label;
  }


  public getMinMaxLengthLabel(field: FieldConfig): string {
    let label = "";    
    if(field.type === 'text' || field.type === 'textarea'){
      const minLength = field.minLength !== undefined ? `min: ${field.minLength}` : '';
      const maxLength = field.maxLength !== undefined ? `max: ${field.maxLength}` : '';
      label = [minLength, maxLength].filter(part => part).join(', ');
    }

    if(label !== ""){
      label = `(${label})`;
    }

    return label;
  }

  private resetValues(): void {
    this.isVisible = false;
    this.feature = null;
    this.layer = null;
    this.fields = [];
    this.category = '';
    this.allVisibleFieldIds = new Set<string>();
    if (this.form) {
      this.form.reset();
    }
  }

  // Helper method to format the current date/time for default values as string for date and datetime fields
  private getNowFormatted(type: 'date' | 'datetime'): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    if (type === 'date') {
      return `${year}-${month}-${day}`;
    } else {
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  }

  /**
   * updates set of visible field IDs (this.allVisibleFieldIds) based on the current form values and the conditions defined for each field
   * @param values current form values
   */
  private updateFieldVisibility(values: Record<string, any>): void {
    const nextVisible = new Set<string>();
    const evaluationValues: Record<string, any> = {
      ...values,
      'form.categories': this.category, // add the pre-selected category to the evaluation values so conditional fields can depend on it
    };

    this.fields.forEach(field => {
      const isVisible = evaluateFieldCondition(field.condition, evaluationValues);
      if (isVisible) {
        nextVisible.add(field.id);
      }

      const control = this.form.get(field.id);
      if (!control) {
        return;
      }

      if (isVisible) {
        //add validators for conditional field if it becomes visible
        // e.g. if a field is required but hidden, it should not be validated until it becomes visible
        control.setValidators(this.buildValidatorsFor(field));
      } else {
        control.clearValidators();
      }
      // emitEvent: false avoids re-triggering the valueChanges subscription that called this method
      control.updateValueAndValidity({ emitEvent: false });
    });

    this.allVisibleFieldIds = nextVisible;
  }

}
