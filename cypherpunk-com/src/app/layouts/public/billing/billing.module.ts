import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { BillingComponent } from './billing.component';
import { BillingLandingComponent } from './billing-landing.component';
import { BillingRoutingModule } from './billing-routing.module';

@NgModule({
  imports: [
    SharedModule,
    BillingRoutingModule
  ],
  declarations: [
    BillingComponent,
    BillingLandingComponent
  ]
})
export class BillingModule { }
