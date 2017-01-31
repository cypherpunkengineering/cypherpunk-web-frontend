import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { TosComponent } from './tos.component';
import { TosRoutingModule } from './tos-routing.module';

@NgModule({
  imports: [
    SharedModule,
    TosRoutingModule
  ],
  declarations: [
    TosComponent
  ]
})
export class TosModule { }
