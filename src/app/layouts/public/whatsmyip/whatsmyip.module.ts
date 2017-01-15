import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { WhatsMyIpComponent } from './whatsmyip.component';
import { WhatsMyIpRoutingModule } from './whatsmyip-routing.module';

@NgModule({
  imports: [
    SharedModule,
    WhatsMyIpRoutingModule
  ],
  declarations: [
    WhatsMyIpComponent
  ]
})
export class WhatsMyIpModule { }
