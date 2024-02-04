import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {MapComponent} from './map/map.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  { path: 'map', component: MapComponent},
// {path: '**', redirectTo: ''}  test to enable qgis server do not be redirected

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
