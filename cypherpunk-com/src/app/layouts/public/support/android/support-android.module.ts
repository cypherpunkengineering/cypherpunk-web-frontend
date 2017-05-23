import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportAndroidComponent } from './support-android.component';
import { SupportAndroidRoutingModule } from './support-android-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportAndroidRoutingModule
  ],
  declarations: [
    SupportAndroidComponent
  ]
})
export class SupportAndroidModule { }
