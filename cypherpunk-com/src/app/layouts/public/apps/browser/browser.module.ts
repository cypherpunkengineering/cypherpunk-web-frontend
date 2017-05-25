import { NgModule } from '@angular/core';
import { BrowserComponent } from './browser.component';
import { AppsSharedModule } from '../apps-shared.module';
import { BrowserRoutingModule } from './browser-routing.module';

@NgModule({
  imports: [
    AppsSharedModule,
    BrowserRoutingModule
  ],
  declarations: [
    BrowserComponent
  ]
})
export class BrowserModule { }
