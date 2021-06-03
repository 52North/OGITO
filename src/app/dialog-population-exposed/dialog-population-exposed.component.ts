import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogData} from '../map/map.component';

// To use noise levels population dialogs
export interface DialogNoisePopData {
  layerList: any;
  lowlevel: number;
  highlevel: number;
  selectedLayer: any;
}

@Component({
  selector: 'app-dialog-population-exposed',
  templateUrl: './dialog-population-exposed.component.html',
  styleUrls: ['./dialog-population-exposed.component.scss']
})
export class DialogPopulationExposedComponent implements OnInit {
  formGroup: FormGroup;
  noiseLevels = [45, 50, 55, 60, 65, 70, 75, 80, 85];
  selectedLayer: any;
  lowLevel: any;
  highLevel: any;

  constructor(
    public dialogRef: MatDialogRef<DialogPopulationExposedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogNoisePopData) {
    this.formGroup = new FormGroup({
      selectedLayer: new FormControl(),
      lowLevel : new FormControl(),
      highLevel : new FormControl()
     });

  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
