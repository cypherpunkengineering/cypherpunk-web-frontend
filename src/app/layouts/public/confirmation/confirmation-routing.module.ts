import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationGuard } from '../../../services/confirmation-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'confirmation', component: ConfirmationComponent, canActivate: [ ConfirmationGuard ] }
    ])
  ]
})
export class ConfirmationRoutingModule { }
