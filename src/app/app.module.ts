import {BrowserModule, HammerModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MapComponent, DialogRatingDialog, DialogRatingMeasureDialog} from './map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import {DemoMaterialModule} from './material-module';
import { EditingToolbarComponent } from './editing-toolbar/editing-toolbar.component';
import { LayerPanelComponent } from './layer-panel/layer-panel.component';
import { SymbolListComponent } from './symbol-list/symbol-list.component';
import { ToolbarComponent, DialogLayerNameDialog } from './toolbar/toolbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule } from '@angular/common/http';
import { ProjlistComponent } from './projlist/projlist.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
import { DialogPopulationExposedComponent } from './dialog-population-exposed/dialog-population-exposed.component';
import { DialogOrgExposedComponent } from './dialog-org-exposed/dialog-org-exposed.component';
import { DialogResultExposedComponent } from './dialog-result-exposed/dialog-result-exposed.component';
import { StreetSearchComponent } from './street-search/street-search.component';
import { EditReportingComponent } from './edit-reporting/edit-reporting.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HomeComponent,
    EditingToolbarComponent,
    LayerPanelComponent,
    SymbolListComponent,
    ToolbarComponent,
    ProjlistComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    DialogRatingDialog,
    DialogRatingMeasureDialog,
    DialogPopulationExposedComponent,
    DialogOrgExposedComponent,
    DialogResultExposedComponent,
    DialogLayerNameDialog,
    StreetSearchComponent,
    EditReportingComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        DemoMaterialModule,
        FormsModule,
        HammerModule,
        HttpClientModule,
        ReactiveFormsModule,
    ],
  providers: [LayerPanelComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
