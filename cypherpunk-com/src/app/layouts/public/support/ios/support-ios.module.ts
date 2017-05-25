import { NgModule } from '@angular/core';
import { SupportIOSComponent } from './support-ios.component';
import { SupportSharedModule } from '../support-shared.module';
import { SupportIOSRoutingModule } from './support-ios-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportIOSRoutingModule
  ],
  declarations: [
    SupportIOSComponent
  ]
})
export class SupportIOSModule { }
