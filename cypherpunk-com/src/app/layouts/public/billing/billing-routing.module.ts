import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BillingComponent } from './billing.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'billing/:referralCode', component: BillingComponent },
      { path: 'billing', component: BillingComponent }
    ])
  ]
})
export class BillingRoutingModule { }
