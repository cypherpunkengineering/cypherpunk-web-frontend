import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { LicenseIOSComponent } from './license-ios.component';
import { LicenseIOSRoutingModule } from './license-ios-routing.module';

@NgModule({
  imports: [
    SharedModule,
    LicenseIOSRoutingModule
  ],
  declarations: [
    LicenseIOSComponent
  ]
})
export class LicenseIOSModule { }
