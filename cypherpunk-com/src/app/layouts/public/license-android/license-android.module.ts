import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { LicenseAndroidComponent } from './license-android.component';
import { LicenseAndroidRoutingModule } from './license-android-routing.module';

@NgModule({
  imports: [
    SharedModule,
    LicenseAndroidRoutingModule
  ],
  declarations: [
    LicenseAndroidComponent
  ]
})
export class LicenseAndroidModule { }
