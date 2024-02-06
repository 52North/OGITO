import {Component, Inject, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {DialogData} from '../map/map.component';

// To use noise levels population dialogs
export interface DialogNoisePopData {
  layerList: any;
  lowlevel: number;
  highlevel: number;
  selectedLayer: any;
  noiseMapList: any;
}

@Component({
  selector: 'app-dialog-population-exposed',
  templateUrl: './dialog-population-exposed.component.html',
  styleUrls: ['./dialog-population-exposed.component.scss']
})
export class DialogPopulationExposedComponent implements OnInit {
  formGroup: UntypedFormGroup;
  noiseLevels = [45, 50, 55, 60, 65, 70, 75, 80, 85];
  selectedLayer: any;
  lowLevel: any;
  highLevel: any;

  constructor(
    public dialogRef: MatDialogRef<DialogPopulationExposedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogNoisePopData) {
    this.formGroup = new UntypedFormGroup({
      selectedLayer: new UntypedFormControl(),
      selectedNoiseLayer: new UntypedFormControl(),
      lowLevel : new UntypedFormControl(),
      highLevel : new UntypedFormControl()
     });

  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
