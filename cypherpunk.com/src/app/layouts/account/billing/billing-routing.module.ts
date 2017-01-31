import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'account/billing',
        component: BillingComponent
      }
    ])
  ]
})
export class BillingRoutingModule { }
