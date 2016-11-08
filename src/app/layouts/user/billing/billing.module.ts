import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { BillingComponent } from './billing.component';
import { BillingRoutingModule } from './billing-routing.module';

@NgModule({
  imports: [
    SharedModule,
    BillingRoutingModule
  ],
  declarations: [
    BillingComponent
  ]
})
export class BillingModule { }
