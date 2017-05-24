import { NgModule } from '@angular/core';
import { SupportIOSComponent } from './support-ios.component';
import { SupportSharedModule } from '../support-shared.module';
import { SupportIOSRoutingModule } from './support-ios-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    SupportSharedModule,
    SupportIOSRoutingModule
  ],
  declarations: [
    SupportIOSComponent
  ]
})
export class SupportIOSModule { }
