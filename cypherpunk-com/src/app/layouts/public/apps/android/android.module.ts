import { NgModule } from '@angular/core';
import { AndroidComponent } from './android.component';
import { AppsSharedModule } from '../apps-shared.module';
import { AndroidRoutingModule } from './android-routing.module';

@NgModule({
  imports: [
    AppsSharedModule,
    AndroidRoutingModule
  ],
  declarations: [
    AndroidComponent
  ]
})
export class AndroidModule { }
