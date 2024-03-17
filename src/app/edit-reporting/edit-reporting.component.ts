import { map, catchError } from "rxjs/operators";
import { AppConstants } from '../app-constants';
import { VectorLayer } from 'ol/layer/Vector';
import { Feature } from 'ol/Feature';
import { Observable, Subscription } from 'rxjs';
import { CustomDialogService, EditedFeature } from '../custom-dialog.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { AppconfigService } from "../config/appconfig.service";
import { LabelLutService } from "../config/label-lut.service";

@Component({
  selector: 'app-edit-reporting',
  templateUrl: './edit-reporting.component.html',
  styleUrls: ['./edit-reporting.component.scss']
})
export class EditReportingComponent implements OnInit {

  @Output() formSubmitted = new EventEmitter<any>();

  private subToInitDialog : Subscription;
  private isVisible: boolean = false;
  private feature : Feature;
  private layer: VectorLayer;
  //form values
  public priorities = ["none", "low", "medium", "high"]
  private nonePriority = this.priorities[0];
  public description: string;
  public date: string = new Date().toISOString().slice(0, 10);
  public imageDescription: string;
  public address: string;
  public isGoodExample: string = "true";
  public priority: string = this.nonePriority;
  private categoryAttr = "category";
  public imageFile: File = null;
  private serverImageFileName: string;
  private uploadPending = false;
  private uploadProgress = 0;

  constructor(private customDialogInitializer: CustomDialogService, private http: HttpClient, private config: AppconfigService, private labelLUT: LabelLutService) {

    this.subToInitDialog = this.customDialogInitializer.editMeldingen$.subscribe(
      (data) => {
        console.log("received edit meldingen event")
        this.startDialog(data);
      },
      (error) => {console.log('Error in subscription to customDialogService.editMeldingen$'); }
    );
   }

  ngOnInit(): void {
  }


  public getVisibility() : boolean {
    return this.isVisible;
  }

  public isUploadPending() : boolean {
    return this.uploadPending;
  }

  public getUploadProgress() : Number {
    return this.uploadProgress;
  }

  public startDialog(newFeature: EditedFeature): void{
    this.feature = newFeature.feature;
    this.layer = newFeature.layer;
    this.isVisible = true;

    this.date = new Date().toISOString().slice(0, 10); //today
  }

  public abbortDialog(){
    if(this.feature && this.layer){
      try{
      this.layer.source.removeFeature(this.feature); //clean feature if dialog is abborted
      }catch(err){
        console.error("error while removing edit feautre" , err);
      }
    }


    this.customDialogInitializer.raiseCustomDialogClosed(this.layer.layerName, true);
    this.resetValues()
  }

  public submitDialog(){


    if(this.imageFile){ //upload image before submit
      console.log("start upload of file " + this.imageFile.name)
      this.uploadPending = true;
      this.uploadImage(this.imageFile, this.config.getAppConfig().imageUploadService).subscribe(
        resp => {
          if (resp.type === HttpEventType.Response) { //complete
              console.log("successfully uploaded image " + this.imageFile.name);
              this.serverImageFileName = this.config.getAppConfig().imageUploadFolder + resp.body["filename"];

              this.publishData()
          }
          if (resp.type === HttpEventType.UploadProgress) { //progress update
              const percentDone = Math.round(100 * resp.loaded / resp.total);
              console.log('upload progress ' + percentDone + '%');
              this.uploadProgress = percentDone;
          }
        },
        err => {
          console.log("Error while uploading file  " + this.imageFile.name);
          console.error(err);
          alert("Could not upload image to the server. \n " + err["error"]["error"])
        }
      ).add(() => {this.uploadPending = false, this.uploadProgress = 0})
    }else{
      this.publishData()
    }
  }

  private publishData(resetForm : boolean = true){
    var goodExampleBool = JSON.parse(this.isGoodExample.trim()) //convert to bool
    var payload = {
      text: (this.description) ? this.description.trim() : "", //attributes must match database table columns
      date: new Date(this.date),
      helpfulness: goodExampleBool,
      priority: (goodExampleBool) ? this.nonePriority : this.priority,
      img: this.serverImageFileName,
      alt_img: (this.imageFile) ? this.imageDescription : null,
      address: (this.imageFile) ? this.address : null,
      category: this.feature.getProperties()[this.categoryAttr]
    }

    console.log("submit reporting: ");
    console.log(payload)
    this.formSubmitted.emit({payload: payload, feature: this.feature, layerName: this.layer.layerName});

    if(resetForm){
      this.customDialogInitializer.raiseCustomDialogClosed(this.layer.layerName, false);
      this.resetValues()
    }
  }

  public isButtonDisabled(){
    var invalidDescrpiton = !this.description || this.description.trim().length === 0;
    var invalidImageDescription = (this.imageFile && (!this.imageDescription ||this.imageDescription.trim().length === 0))

    //return (invalidDescrpiton ||invalidImageDescription || this.uploadPending)
    return this.uploadPending; //no mandatory fields only disable button during image upload
  }

  public onFileSelected(event){
    const selectedFile : File = event.target.files[0];

    if (selectedFile) {
      this.imageFile = selectedFile;
      console.log(this.imageFile.name)
    }else{
      this.imageFile = null;
    }
  }

  getLabel(propertyName: string, defaultLabel: string){
    if(this.labelLUT.hasLabel(this.layer.layerName, propertyName)){
      return this.labelLUT.getLabelForPropertyName(this.layer.layerName, propertyName);
    }else{
      return defaultLabel
    }
  }

  private resetValues(){
    this.isVisible = false;
    this.feature = null;
    this.layer = null;

    this.description = null;
    this.priority = this.nonePriority;
    this.isGoodExample = "true";
    this.imageDescription = null;
    this.imageFile = null;
    this.address = null;
    this.serverImageFileName = null;
    this.uploadPending = false;
    this.uploadProgress = 0;
  }

  private uploadImage(file: File, destPath: string) : Observable<any>{
    const formData = new FormData();
    formData.append("image", file, file.name);
    //post image to backend server
    return this.http
    .post(destPath , formData ,  {reportProgress: true, observe: 'events'});

  }
}
