import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BillingComponent } from './billing.component';
import { AuthGuard } from '../../../services/auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'account/billing', component: BillingComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class BillingRoutingModule { }
