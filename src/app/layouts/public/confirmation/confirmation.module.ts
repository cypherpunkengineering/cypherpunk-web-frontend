import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationRoutingModule } from './confirmation-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ConfirmationRoutingModule
  ],
  declarations: [
    ConfirmationComponent
  ]
})
export class ConfirmationModule { }
