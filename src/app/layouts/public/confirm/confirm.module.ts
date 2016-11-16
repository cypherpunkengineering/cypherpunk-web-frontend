import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { ConfirmComponent } from './confirm.component';
import { ConfirmRoutingModule } from './confirm-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ConfirmRoutingModule
  ],
  declarations: [
    ConfirmComponent
  ]
})
export class ConfirmModule { }
