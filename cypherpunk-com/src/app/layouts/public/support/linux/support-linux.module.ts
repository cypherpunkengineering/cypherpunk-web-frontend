import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportLinuxComponent } from './support-linux.component';
import { SupportLinuxRoutingModule } from './support-linux-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportLinuxRoutingModule
  ],
  declarations: [
    SupportLinuxComponent
  ]
})
export class SupportLinuxModule { }
