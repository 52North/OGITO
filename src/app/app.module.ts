import {BrowserModule, HammerModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import {DemoMaterialModule} from './material-module';
import { EditingToolbarComponent } from './editing-toolbar/editing-toolbar.component';
import { LayerPanelComponent } from './layer-panel/layer-panel.component';
import { SymbolListComponent } from './symbol-list/symbol-list.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule } from '@angular/common/http';
import { ProjlistComponent } from './projlist/projlist.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
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
    DynamicFormQuestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    HammerModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [LayerPanelComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
