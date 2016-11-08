import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { JoinComponent } from './join.component';
import { JoinRoutingModule } from './join-routing.module';

@NgModule({
  imports: [
    SharedModule,
    JoinRoutingModule
  ],
  declarations: [
    JoinComponent
  ]
})
export class JoinModule { }
