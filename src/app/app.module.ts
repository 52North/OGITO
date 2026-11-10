import {BrowserModule, HammerModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MapComponent, DialogRatingMeasureDialog} from './map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import {MaterialModule} from './material-module';
import { EditingToolbarComponent } from './editing-toolbar/editing-toolbar.component';
import { LayerPanelComponent } from './layer-panel/layer-panel.component';
import { SymbolListComponent } from './symbol-list/symbol-list.component';
import { ToolbarComponent, DialogLayerNameDialog } from './toolbar/toolbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BackendAuthInterceptor } from './auth/backend-auth.interceptor';
import { ProjlistComponent } from './projlist/projlist.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { StreetSearchComponent } from './street-search/street-search.component';
import { EditReportingComponent } from './edit-reporting/edit-reporting.component';
import { CustomSketchLayerFormComponent } from './custom-sketch-layer-form/custom-sketch-layer-form.component';
import { GeocoderComponent } from './geocoder/geocoder.component';

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
    DialogRatingMeasureDialog,
    DialogLayerNameDialog,
    StreetSearchComponent,
    EditReportingComponent,
    CustomSketchLayerFormComponent,
    GeocoderComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        HammerModule,
        HttpClientModule,
        ReactiveFormsModule,
        OAuthModule.forRoot(),
    ],
  providers: [
    LayerPanelComponent,
    { provide: HTTP_INTERCEPTORS, useClass: BackendAuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
