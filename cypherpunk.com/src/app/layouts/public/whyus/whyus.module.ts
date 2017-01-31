import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { WhyusComponent } from './whyus.component';
import { WhyusRoutingModule } from './whyus-routing.module';

@NgModule({
  imports: [
    SharedModule,
    WhyusRoutingModule
  ],
  declarations: [
    WhyusComponent
  ]
})
export class WhyusModule { }
