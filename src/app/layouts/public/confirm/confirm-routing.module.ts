import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ConfirmComponent } from './confirm.component';
import { ConfirmGuard } from '../../../services/confirm-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'confirm', component: ConfirmComponent, canActivate: [ ConfirmGuard ] }
    ])
  ]
})
export class ConfirmRoutingModule { }
