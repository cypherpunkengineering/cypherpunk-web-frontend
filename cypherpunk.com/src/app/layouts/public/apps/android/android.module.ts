import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { AndroidComponent } from './android.component';
import { AndroidRoutingModule } from './android-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AndroidRoutingModule
  ],
  declarations: [
    AndroidComponent
  ]
})
export class AndroidModule { }
