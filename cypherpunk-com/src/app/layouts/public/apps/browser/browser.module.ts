import { NgModule } from '@angular/core';
import { BrowserComponent } from './browser.component';
import { AppsSharedModule } from '../apps-shared.module';
import { BrowserRoutingModule } from './browser-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AppsSharedModule,
    BrowserRoutingModule
  ],
  declarations: [
    BrowserComponent
  ]
})
export class BrowserModule { }
