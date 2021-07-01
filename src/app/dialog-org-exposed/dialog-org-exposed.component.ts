import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogNoisePopData} from '../dialog-population-exposed/dialog-population-exposed.component';

@Component({
  selector: 'app-dialog-org-exposed',
  templateUrl: './dialog-org-exposed.component.html',
  styleUrls: ['./dialog-org-exposed.component.scss']
})
export class DialogOrgExposedComponent implements OnInit {
  formGroup: FormGroup;
  noiseLevels = [45, 50, 55, 60, 65, 70, 75, 80, 85];
  selectedLayer: any;
  lowLevel: any;
  highLevel: any;


  constructor(
    public dialogRef: MatDialogRef<DialogOrgExposedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogNoisePopData) {
    this.formGroup = new FormGroup({
      selectedLayer: new FormControl(),
      selectedNoiseLayer: new FormControl(),
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
