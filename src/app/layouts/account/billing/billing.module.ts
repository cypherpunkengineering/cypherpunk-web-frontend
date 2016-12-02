import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { BillingComponent } from './billing.component';
import { BillingRoutingModule } from './billing-routing.module';
import { BillingResolver } from '../../../resolvers/billing.resolver';

@NgModule({
  imports: [
    SharedModule,
    BillingRoutingModule
  ],
  declarations: [
    BillingComponent
  ],
  providers: [
    BillingResolver
  ]
})
export class BillingModule { }
