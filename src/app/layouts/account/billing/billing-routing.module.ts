import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';
import { BillingResolver } from '../../../resolvers/billing.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'account/billing',
        component: BillingComponent,
        resolve: {
          billing: BillingResolver
        }
      }
    ])
  ]
})
export class BillingRoutingModule { }
