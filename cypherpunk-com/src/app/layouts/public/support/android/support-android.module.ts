import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportAndroidComponent } from './support-android.component';
import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportAndroidRoutingModule } from './support-android-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportSharedModule,
    SupportAndroidRoutingModule
  ],
  declarations: [
    SupportAndroidComponent
  ]
})
export class SupportAndroidModule { }
