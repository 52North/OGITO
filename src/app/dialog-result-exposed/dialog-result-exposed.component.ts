import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup} from '@angular/forms';
import {DialogNoisePopData} from '../dialog-population-exposed/dialog-population-exposed.component';

// To use noise levels population dialogs
export interface DialogResultData {
  summary: any;
  totalCount: number;
}

@Component({
  selector: 'app-dialog-result-exposed',
  templateUrl: './dialog-result-exposed.component.html',
  styleUrls: ['./dialog-result-exposed.component.scss']
})
export class DialogResultExposedComponent implements OnInit {
 // text: string;

 constructor(public dialogRef: MatDialogRef<DialogResultExposedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogResultData) {

  }

  ngOnInit(): void {
  }

  onClick(): void {
    this.dialogRef.close();
  }
}
