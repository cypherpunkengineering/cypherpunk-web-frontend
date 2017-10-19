import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BillingComponent } from './billing.component';
import { BillingLandingComponent } from './billing-landing.component';

const withProvider = [
  { path: ':provider', component: BillingLandingComponent },
  { path: '', pathMatch: 'full', component: BillingLandingComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'billing/complete', children: withProvider },
      { path: 'billing/pending', children: withProvider },
      { path: 'billing/error', children: withProvider },
      { path: 'billing/cancel', children: withProvider },
      { path: 'billing/:referralCode', component: BillingComponent },
      { path: 'billing', component: BillingComponent }
    ])
  ]
})
export class BillingRoutingModule { }
