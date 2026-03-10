import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FieldConfig } from '../config/custom-sketch-layer-config';
import { CustomDialogService, EditedFeatureCustomSketchLayer } from '../custom-dialog.service';
import { Subscription } from 'rxjs';
import { VectorLayer } from 'ol/layer/Vector';
import { Feature } from 'ol/Feature';

@Component({
  selector: 'app-custom-sketch-layer-form',
  templateUrl: './custom-sketch-layer-form.component.html',
  styleUrls: ['./custom-sketch-layer-form.component.scss']
})
export class CustomSketchLayerFormComponent{
@Output() formSubmitted = new EventEmitter<any>();

  private subToInitDialog!: Subscription;
  private isVisible: boolean = false;
  
  public form!: FormGroup;
  public fields: FieldConfig[] = [];
  public layerName: string = '';
  public category = '';
  
  private feature: Feature;
  private layer: VectorLayer;

  constructor(
    private fb: FormBuilder,
    private customDialogInitializer: CustomDialogService
  ) {}

  ngOnInit(): void {
    // Listen for the external event to open the dynamic form
    // You may need to adjust the observable name to match your service
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
  }

  public getVisibility(): boolean {
    return this.isVisible;
  }

  public startDialog(data: EditedFeatureCustomSketchLayer): void {
    this.feature = data.feature;
    this.layer = data.layer;
    this.layerName = data.layerDefinition.layername;
    this.fields = data.layerDefinition.fields;
    this.category = data.feature.get("category");

    // Build the Reactive Form based on the new configuration
    const formControls: { [key: string]: FormControl } = {};

    this.fields.forEach(field => {
      const fieldValidators = [];
      if (field.required) {
        fieldValidators.push(Validators.required);
      }

      formControls[field.id] = new FormControl(
        {
          value: field.default !== undefined ? field.default : null,
          disabled: field.readonly || false
        },
        fieldValidators
      );
    });

    this.form = this.fb.group(formControls);
    this.isVisible = true;
  }

  public abbortDialog(): void {
    // If you need to clean up the feature from the map layer on abort, do it here
    if (this.feature && this.layer) {
      try {
        this.layer.source.removeFeature(this.feature);
      } catch (err) {
        console.error("Error while removing edit feature", err);
      }
    }

    if (this.layer) {
      this.customDialogInitializer.raiseCustomDialogClosed(this.layer.layerName, true);
    }
    this.resetValues();
  }

  public submitDialog(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
      this.customDialogInitializer.raiseCustomDialogClosed(this.layer.layerName, false);
    }
    this.resetValues();
  }

  private resetValues(): void {
    this.isVisible = false;
    this.feature = null;
    this.layer = null;
    this.fields = [];
    this.category = '';
    if (this.form) {
      this.form.reset();
    }
  }
}
