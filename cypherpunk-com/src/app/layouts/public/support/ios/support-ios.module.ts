import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportIOSComponent } from './support-ios.component';
import { SupportIOSRoutingModule } from './support-ios-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportIOSRoutingModule
  ],
  declarations: [
    SupportIOSComponent
  ]
})
export class SupportIOSModule { }
