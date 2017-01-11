import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { BrowserComponent } from './browser.component';
import { BrowserRoutingModule } from './browser-routing.module';

@NgModule({
  imports: [
    SharedModule,
    BrowserRoutingModule
  ],
  declarations: [
    BrowserComponent
  ]
})
export class BrowserModule { }
