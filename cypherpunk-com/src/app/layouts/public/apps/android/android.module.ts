import { NgModule } from '@angular/core';
import { AndroidComponent } from './android.component';
import { AppsSharedModule } from '../apps-shared.module';
import { AndroidRoutingModule } from './android-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AppsSharedModule,
    AndroidRoutingModule
  ],
  declarations: [
    AndroidComponent
  ]
})
export class AndroidModule { }
