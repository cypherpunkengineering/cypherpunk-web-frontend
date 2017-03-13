import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { BountyComponent } from './bounty.component';
import { BountyRoutingModule } from './bounty-routing.module';

@NgModule({
  imports: [
    SharedModule,
    BountyRoutingModule
  ],
  declarations: [
    BountyComponent
  ]
})
export class BountyModule { }
