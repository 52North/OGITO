import { catchError } from 'rxjs/operators';
import { AppConfiguration } from './../app-configuration';
import { VectorLayer } from 'ol/layer/Vector';
import { Feature } from 'ol/Feature';
import { Observable, Subscription } from 'rxjs';
import { CustomDialogService, EditedFeature } from './../custom-dialog.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-meldingen',
  templateUrl: './edit-meldingen.component.html',
  styleUrls: ['./edit-meldingen.component.scss']
})
export class EditMeldingenComponent implements OnInit {

  @Output() formSubmitted = new EventEmitter<any>();

  private subToInitDialog : Subscription;
  private isVisible: boolean = false;
  private feature : Feature;
  private layer: VectorLayer;
  private userimageFolder: string =  AppConfiguration.userImageFolder;
  //form values
  public priorities = ["geen", "laag", "medium", "hoog"]
  private nonePriority = this.priorities[0];
  public description: string;
  public date: Date = new Date();
  public imageDescription: string;
  public isGoodExample: string = "true";
  public priority: string = this.nonePriority;
  private categoryAttr = "categorie";
  public imageFile: File = null;
  private uploadedImagePath: string;
  private uploadPending = false;

  constructor(private customDialogInitializer: CustomDialogService, private http: HttpClient) {

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

  public startDialog(newFeature: EditedFeature): void{
    this.feature = newFeature.feature;
    this.layer = newFeature.layer;
    this.isVisible = true;

    this.date = new Date(); //current datetime
  }

  public abbortDialog(){
    if(this.feature && this.layer){
      this.layer.source.removeFeature(this.feature); //clean feature if dialog is abborted
    }

    this.resetValues()
  }

  public submitDialog(){


    if(this.imageFile){ //upload image before submit
      console.log("start upload of file " + this.imageFile.name)
      this.uploadPending = true;
      this.uploadImage(this.imageFile, this.userimageFolder).subscribe(
        el => {
          console.log("successfully uploaded image " + this.imageFile.name);
          //wait for upload finished
          this.publishData()
        },
        err => {
          console.log("Error while uploading file  " + this.imageFile.name);
          console.error(err);
          alert("De foto kon niet worden geüpload.")
        }
      ).add(() => { this.uploadPending = false})
    }else{
      this.publishData()
    }
  }

  private publishData(resetForm : boolean = true){
    var goodExampleBool = JSON.parse(this.isGoodExample.trim()) //convert to bool
    var payload = {
      tekst: (this.description) ? this.description.trim() : "",
      datum: this.date,
      behulpzaamheid: goodExampleBool,
      //prioriteit: (goodExampleBool) ? this.nonePriority : this.priority,
      //img: this.imageFile.name,
      //alt_text: (this.imageFile) ? this.imageDescription : null,
      categorie: this.feature.getProperties()[this.categoryAttr]
    }

    console.log("submit meldingen: ");
    console.log(payload)
    this.formSubmitted.emit({payload: payload, feature: this.feature, layerName: this.layer.layerName});

    if(resetForm){
      this.resetValues()
    }
  }

  public isButtonDisabled(){
    var invalidDescrpiton = !this.description || this.description.trim().length === 0;
    var invalidImageDescription = (this.imageFile && (!this.imageDescription ||this.imageDescription.trim().length === 0))

    return (invalidDescrpiton ||invalidImageDescription || this.uploadPending)
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

  private resetValues(){
    this.isVisible = false;
    this.feature = null;
    this.layer = null;

    this.description = null;
    this.priority = this.nonePriority;
    this.isGoodExample = "true";
    this.imageDescription = null;
    this.imageFile = null
    this.uploadedImagePath = null;
    this.uploadPending = false;
  }

  private uploadImage(file: File, destPath: string) : Observable<Object>{
    const formData = new FormData();
    const serverFilename = "userimage_" + new Date().getTime().toString()
    formData.append("img", file, serverFilename);
    this.uploadedImagePath = destPath + serverFilename;

    return this.http
    .post(destPath , formData)
  }
}
