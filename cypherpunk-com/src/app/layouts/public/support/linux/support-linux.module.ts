import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportLinuxComponent } from './support-linux.component';
import { SupportLinuxRoutingModule } from './support-linux-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportLinuxRoutingModule
  ],
  declarations: [
    SupportLinuxComponent
  ]
})
export class SupportLinuxModule { }
