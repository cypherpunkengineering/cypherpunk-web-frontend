import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { ResetComponent } from './reset.component';
import { ResetRoutingModule } from './reset-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ResetRoutingModule
  ],
  declarations: [
    ResetComponent
  ]
})
export class ResetModule { }
