import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportLinuxComponent } from './support-linux.component';
import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportLinuxRoutingModule } from './support-linux-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportSharedModule,
    SupportLinuxRoutingModule
  ],
  declarations: [
    SupportLinuxComponent
  ]
})
export class SupportLinuxModule { }
