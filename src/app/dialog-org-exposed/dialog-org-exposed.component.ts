import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {DialogNoisePopData} from '../dialog-population-exposed/dialog-population-exposed.component';

@Component({
  selector: 'app-dialog-org-exposed',
  templateUrl: './dialog-org-exposed.component.html',
  styleUrls: ['./dialog-org-exposed.component.scss']
})
export class DialogOrgExposedComponent implements OnInit {
  formGroup: UntypedFormGroup;
  noiseLevels = [45, 50, 55, 60, 65, 70, 75, 80, 85];
  selectedLayer: any;
  lowLevel: any;
  highLevel: any;


  constructor(
    public dialogRef: MatDialogRef<DialogOrgExposedComponent>,
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
