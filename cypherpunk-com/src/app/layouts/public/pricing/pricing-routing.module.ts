import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PricingComponent } from './pricing.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'pricing/:referralCode', component: PricingComponent },
      { path: 'pricing', component: PricingComponent }
    ])
  ]
})
export class PricingRoutingModule { }
