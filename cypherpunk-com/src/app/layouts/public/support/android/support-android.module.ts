import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportAndroidComponent } from './support-android.component';
import { SupportAndroidRoutingModule } from './support-android-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportAndroidRoutingModule
  ],
  declarations: [
    SupportAndroidComponent
  ]
})
export class SupportAndroidModule { }
